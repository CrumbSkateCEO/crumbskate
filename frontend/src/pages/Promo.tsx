import { useCallback, useEffect, useRef, useState } from "react";

/* ============================================================
   CRUMBSKATE — VIDEO PROMOCIONAL (render en canvas)
   - 1920x1080 (16:9), encuadre CENTER-SAFE: toda la acción y
     los textos viven en el tercio central (~608px) para que el
     recorte a 9:16 no pierda nada vital.
   - Estética cruda: MiniDV gastada, grano, cámara en mano,
     paneos con desenfoque, cortes secos a ~120 BPM (beat 500ms).
   - Exporta a MP4/WebM real con MediaRecorder.

   FIXES DE CALIDAD DE EXPORTACIÓN (respecto a la versión anterior):
   1) El grano/estática de pantalla completa es contenido muy caro
      de comprimir. Se sube el bitrate de grabación bastante por
      encima de lo típico para 1080p.
   2) El encoder de hardware que Chrome usa para mux mp4/avc1 en
      MediaRecorder suele IGNORAR videoBitsPerSecond y cae a menor
      calidad. Se prioriza VP9/WebM (software), que sí respeta el
      bitrate pedido, y se cae a mp4 solo si vp9 no está disponible.
   3) `ctx.filter` (brightness/saturate) aplicado en cada frame sobre
      casi toda la pantalla era el costo de dibujo más alto del loop
      y podía provocar frames perdidos/duplicados al capturar el
      stream. Ahora se precalcula UNA sola vez por imagen (al cargar)
      en un canvas offscreen, y cada frame solo hace drawImage.
   4) Las scanlines + viñeta (216 fillRect + gradiente radial por
      frame) también se precalculan una sola vez en un canvas
      offscreen y se pegan con un único drawImage por frame.
   5) Se corrige una condición de carrera: las guías de recorte 9:16
      podían colarse en el primer frame grabado porque el flag salía
      de un re-render de React (asíncrono) en lugar de actualizarse
      en el mismo tick en que arranca la grabación.
   ============================================================ */

const W = 1920;
const H = 1080;
const CENTER_W = Math.round((H * 9) / 16); // 607px zona segura 9:16
const CENTER_X = (W - CENTER_W) / 2;

const BEAT = 500; // 120 BPM
const RED = "#8B1A1A";
const RED_LIGHT = "#c93a3a";

// Timeline: cortes anclados al beat (múltiplos de 500ms)
const SCENES = [
  { id: "static", start: 0, end: 5 * BEAT },        // 0.0 - 2.5s
  { id: "asfalto", start: 5 * BEAT, end: 12 * BEAT }, // 2.5 - 6.0s
  { id: "golpe", start: 12 * BEAT, end: 19 * BEAT },  // 6.0 - 9.5s
  { id: "romperse", start: 19 * BEAT, end: 26 * BEAT }, // 9.5 - 13.0s
  { id: "ruido", start: 26 * BEAT, end: 33 * BEAT },  // 13.0 - 16.5s
  { id: "flash", start: 33 * BEAT, end: 37 * BEAT },  // 16.5 - 18.5s
  { id: "reveal", start: 37 * BEAT, end: 48 * BEAT }, // 18.5 - 24.0s
] as const;

const DURATION = SCENES[SCENES.length - 1].end;

const IMG_SOURCES = {
  grind: "/promo/skater-grind.png",
  concrete: "/promo/concrete-texture.png",
  crew: "/promo/crew-night.png",
  deck: "/promo/deck-diy.png",
} as const;

// Cada foto ahora viaja junto con su variante oscurecida/desaturada
// precalculada (para el relleno lateral), así no hace falta aplicar
// ctx.filter en cada frame.
type Photo = { img: HTMLImageElement; dark: HTMLCanvasElement };
type PhotoMap = Record<keyof typeof IMG_SOURCES, Photo>;

/* ---------- utilidades ---------- */

// pseudo-random determinista por frame (para jitter estable)
function rnd(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function makeNoiseTiles(count = 4, size = 256) {
  const tiles: HTMLCanvasElement[] = [];
  for (let i = 0; i < count; i++) {
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const ctx = c.getContext("2d")!;
    const data = ctx.createImageData(size, size);
    for (let p = 0; p < data.data.length; p += 4) {
      const v = Math.random() * 255;
      data.data[p] = v;
      data.data[p + 1] = v;
      data.data[p + 2] = v;
      data.data[p + 3] = 255;
    }
    ctx.putImageData(data, 0, 0);
    tiles.push(c);
  }
  return tiles;
}

// Precalcula UNA vez la variante oscura/desaturada de una imagen,
// en vez de aplicar ctx.filter en cada uno de los ~700 frames del loop.
function makeDarkVariant(img: HTMLImageElement): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = img.width;
  c.height = img.height;
  const dctx = c.getContext("2d")!;
  dctx.filter = "brightness(0.28) saturate(0.6)";
  dctx.drawImage(img, 0, 0);
  return c;
}

// Precalcula scanlines + viñeta UNA vez (antes: 216 fillRect + un
// gradiente radial recreados en cada frame).
function makeStaticOverlay(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const octx = c.getContext("2d")!;

  octx.save();
  octx.globalAlpha = 0.1;
  octx.fillStyle = "#000";
  for (let y = 0; y < H; y += 5) octx.fillRect(0, y, W, 1.5);
  octx.restore();

  const v = octx.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, H * 0.95);
  v.addColorStop(0, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(0,0,0,0.5)");
  octx.fillStyle = v;
  octx.fillRect(0, 0, W, H);

  return c;
}

// Cachea los gradientes estáticos de drawPhoto (dependen solo de
// constantes W/H/CENTER_X, no de nada por-frame) para no recrearlos
// en cada llamada. Se guardan por contexto porque CanvasGradient
// está atado al ctx que lo creó.
const photoGradientCache = new WeakMap<
  CanvasRenderingContext2D,
  { sideLeft: CanvasGradient; sideRight: CanvasGradient; bottomFade: CanvasGradient }
>();

function getPhotoGradients(ctx: CanvasRenderingContext2D) {
  let g = photoGradientCache.get(ctx);
  if (!g) {
    const sideLeft = ctx.createLinearGradient(CENTER_X - 160, 0, CENTER_X + 40, 0);
    sideLeft.addColorStop(0, "rgba(0,0,0,0.85)");
    sideLeft.addColorStop(1, "rgba(0,0,0,0)");

    const sideRight = ctx.createLinearGradient(W - CENTER_X + 160, 0, W - CENTER_X - 40, 0);
    sideRight.addColorStop(0, "rgba(0,0,0,0.85)");
    sideRight.addColorStop(1, "rgba(0,0,0,0)");

    const bottomFade = ctx.createLinearGradient(0, H * 0.45, 0, H);
    bottomFade.addColorStop(0, "rgba(0,0,0,0)");
    bottomFade.addColorStop(1, "rgba(0,0,0,0.82)");

    g = { sideLeft, sideRight, bottomFade };
    photoGradientCache.set(ctx, g);
  }
  return g;
}

/* ---------- dibujo de escenas ---------- */

// Foto vertical a altura completa, centrada (center-safe),
// con relleno lateral oscuro estirado de la misma foto.
function drawPhoto(
  ctx: CanvasRenderingContext2D,
  photo: Photo,
  t: number,
  sceneT: number,
  sceneDur: number
) {
  const { img, dark } = photo;

  // paneo de latigazo al entrar (primeros 180ms) + drift de zoom
  const whip = Math.max(0, 1 - sceneT / 180);
  const whipX = whip * whip * 220 * (rnd(Math.floor(t / 90)) > 0.5 ? 1 : -1);
  // cámara en mano: jitter
  const f = Math.floor(t / 66);
  const sx = (rnd(f) - 0.5) * 10 + whipX;
  const sy = (rnd(f + 99) - 0.5) * 7;
  const zoom = 1.02 + 0.07 * (sceneT / sceneDur);

  // relleno lateral: variante oscura precalculada, sin ctx.filter por frame
  ctx.drawImage(dark, -40 + sx * 0.4, -40, W + 80, H + 80);

  // foto principal centrada a altura completa
  const ph = H * zoom;
  const pw = ph * (img.width / img.height);
  const px = (W - pw) / 2 + sx;
  const py = (H - ph) / 2 + sy;

  // motion blur del latigazo: copias fantasma
  if (whip > 0.05) {
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.drawImage(img, px - whipX * 0.5, py, pw, ph);
    ctx.globalAlpha = 0.18;
    ctx.drawImage(img, px - whipX, py, pw, ph);
    ctx.restore();
  }
  ctx.drawImage(img, px, py, pw, ph);

  // viñeta lateral para fundir la foto con el relleno (gradientes cacheados)
  const { sideLeft, sideRight, bottomFade } = getPhotoGradients(ctx);
  ctx.fillStyle = sideLeft;
  ctx.fillRect(0, 0, CENTER_X + 40, H);
  ctx.fillStyle = sideRight;
  ctx.fillRect(W - CENTER_X - 40, 0, CENTER_X + 40, H);

  // oscurecer base para el texto
  ctx.fillStyle = bottomFade;
  ctx.fillRect(0, 0, W, H);
}

// Texto grande con glitch, SIEMPRE dentro del tercio central
function drawLines(
  ctx: CanvasRenderingContext2D,
  t: number,
  sceneT: number,
  lines: { text: string; color?: string; size?: number }[],
  yStart: number
) {
  const f = Math.floor(t / 80);
  let y = yStart;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i];
    const size = ln.size ?? 92;
    const appear = Math.min(1, Math.max(0, (sceneT - 250 - i * 220) / 200));
    if (appear <= 0) continue;

    const jx = (rnd(f + i * 7) - 0.5) * 4;
    const jy = (rnd(f + i * 13) - 0.5) * 3;
    const slide = (1 - appear) * (i % 2 === 0 ? -60 : 60);

    ctx.save();
    ctx.globalAlpha = appear;
    ctx.font = `900 ${size}px "Archivo Black", "Arial Black", Impact, sans-serif`;

    // glitch: capa roja desplazada de vez en cuando
    if (rnd(f + i * 31) > 0.72) {
      ctx.fillStyle = RED_LIGHT;
      ctx.fillText(ln.text.toUpperCase(), W / 2 + jx + 5 + slide, y + jy, CENTER_W - 60);
    }
    ctx.fillStyle = "rgba(0,0,0,0.9)";
    ctx.fillText(ln.text.toUpperCase(), W / 2 + jx + 4 + slide, y + jy + 4, CENTER_W - 60);
    ctx.fillStyle = ln.color ?? "#ffffff";
    ctx.fillText(ln.text.toUpperCase(), W / 2 + jx + slide, y + jy, CENTER_W - 60);
    ctx.restore();

    y += size * 1.08;
  }
}

function drawKicker(ctx: CanvasRenderingContext2D, sceneT: number, text: string, y: number) {
  if (sceneT < 200) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, (sceneT - 200) / 200);
  ctx.font = `400 26px "Courier New", monospace`;
  ctx.textAlign = "center";
  ctx.fillStyle = "#ff6b5e";
  ctx.fillText(text.toUpperCase().split("").join("\u200a"), W / 2, y, CENTER_W - 80);
  ctx.restore();
}

function drawStatic(ctx: CanvasRenderingContext2D, t: number, sceneT: number, noise: HTMLCanvasElement[]) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  const tile = noise[Math.floor(t / 50) % noise.length];
  ctx.save();
  ctx.globalAlpha = 0.35 + rnd(Math.floor(t / 60)) * 0.25;
  const pat = ctx.createPattern(tile, "repeat")!;
  ctx.fillStyle = pat;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  // banda de rodado vertical (VHS)
  const bandY = ((t * 0.9) % (H + 300)) - 150;
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.fillRect(0, bandY, W, 90);

  drawLines(ctx, t, sceneT, [{ text: "Nadie pidió permiso." }], H / 2);
}

function drawFlash(ctx: CanvasRenderingContext2D, t: number, sceneT: number, photos: PhotoMap) {
  // cortes cada medio beat: alterna imágenes en flashes duros
  const order: (keyof PhotoMap)[] = ["grind", "deck", "crew", "concrete"];
  const idx = Math.floor(sceneT / (BEAT / 2)) % order.length;
  drawPhoto(ctx, photos[order[idx]], t, sceneT % (BEAT / 2), BEAT / 2);
  // flash blanco en el corte
  const cutT = sceneT % (BEAT / 2);
  if (cutT < 60) {
    ctx.fillStyle = `rgba(255,255,255,${0.5 * (1 - cutT / 60)})`;
    ctx.fillRect(0, 0, W, H);
  }
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.fillRect(0, 0, W, H);
  drawLines(ctx, t, 600, [{ text: "Hecho de migajas.", size: 110, color: "#fff" }], H / 2);
}

function drawReveal(ctx: CanvasRenderingContext2D, t: number, sceneT: number) {
  ctx.fillStyle = "#110C0C";
  ctx.fillRect(0, 0, W, H);
  const f = Math.floor(t / 80);

  // logo con entrada de golpe
  const pop = Math.min(1, sceneT / 250);
  const scale = 1.5 - 0.5 * pop;

  ctx.save();
  ctx.translate(W / 2, H / 2 - 130);
  ctx.scale(scale, scale);
  ctx.globalAlpha = pop;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `900 170px "Archivo Black", "Arial Black", Impact, sans-serif`;
  const jx = (rnd(f) - 0.5) * 5;
  if (rnd(f + 3) > 0.7) {
    ctx.fillStyle = RED_LIGHT;
    ctx.fillText("CRUMB", jx + 6, -85);
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillText("SKATE", jx - 6, 85);
  }
  ctx.fillStyle = "#ffffff";
  ctx.fillText("CRUMB", jx, -85);
  ctx.fillStyle = RED_LIGHT;
  ctx.fillText("SKATE", jx, 85);
  ctx.restore();

  // sello AGOSTO 2026
  if (sceneT > 800) {
    const stampPop = Math.min(1, (sceneT - 800) / 180);
    ctx.save();
    ctx.translate(W / 2, H / 2 + 190);
    ctx.rotate(-0.035);
    ctx.scale(2 - stampPop, 2 - stampPop);
    ctx.globalAlpha = stampPop;
    ctx.fillStyle = "#000";
    ctx.fillRect(-250 + 8, -55 + 8, 500, 110);
    ctx.fillStyle = RED;
    ctx.fillRect(-250, -55, 500, 110);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 5;
    ctx.strokeRect(-250, -55, 500, 110);
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `900 58px "Archivo Black", "Arial Black", Impact, sans-serif`;
    ctx.fillText("AGOSTO 2026", 0, 4);
    ctx.restore();
  }

  // handle
  if (sceneT > 1400) {
    ctx.save();
    ctx.globalAlpha = Math.min(1, (sceneT - 1400) / 300) * (0.6 + rnd(f + 9) * 0.4);
    ctx.font = `400 30px "Courier New", monospace`;
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillText("P R Ó X I M A M E N T E  —  @ C R U M B S K A T E", W / 2, H / 2 + 320, CENTER_W - 60);
    ctx.restore();
  }
}

/* ---------- overlays globales ---------- */

function drawOverlays(
  ctx: CanvasRenderingContext2D,
  t: number,
  noise: HTMLCanvasElement[],
  staticOverlay: HTMLCanvasElement
) {
  // grano (animado, se recalcula por frame — es barato, es solo un pattern fill)
  const tile = noise[Math.floor(t / 80) % noise.length];
  ctx.save();
  ctx.globalAlpha = 0.07;
  ctx.globalCompositeOperation = "screen";
  const pat = ctx.createPattern(tile, "repeat")!;
  ctx.fillStyle = pat;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  // scanlines + viñeta: precalculadas una sola vez, ahora es un solo drawImage
  ctx.drawImage(staticOverlay, 0, 0);

  // parpadeo de exposición analógico
  if (rnd(Math.floor(t / 120)) > 0.93) {
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    ctx.fillRect(0, 0, W, H);
  }
}

/* ---------- frame principal ---------- */

function drawFrame(
  ctx: CanvasRenderingContext2D,
  t: number,
  photos: PhotoMap,
  noise: HTMLCanvasElement[],
  staticOverlay: HTMLCanvasElement
) {
  const time = t % DURATION;
  const scene = SCENES.find((s) => time >= s.start && time < s.end) ?? SCENES[0];
  const sceneT = time - scene.start;
  const sceneDur = scene.end - scene.start;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);

  switch (scene.id) {
    case "static":
      drawStatic(ctx, time, sceneT, noise);
      break;
    case "asfalto":
      drawPhoto(ctx, photos.grind, time, sceneT, sceneDur);
      drawKicker(ctx, sceneT, "El rugido del uretano", H - 360);
      drawLines(ctx, time, sceneT, [
        { text: "El asfalto" },
        { text: "no perdona.", color: RED_LIGHT },
      ], H - 265);
      break;
    case "golpe":
      drawPhoto(ctx, photos.concrete, time, sceneT, sceneDur);
      drawLines(ctx, time, sceneT, [
        { text: "Resiste", size: 130 },
        { text: "el golpe.", size: 130, color: RED_LIGHT },
      ], H / 2 - 60);
      break;
    case "romperse":
      drawPhoto(ctx, photos.deck, time, sceneT, sceneDur);
      drawKicker(ctx, sceneT, "Tabla astillada, tail muerto", H - 400);
      drawLines(ctx, time, sceneT, [
        { text: "Construido para" },
        { text: "romperse.", color: RED_LIGHT },
        { text: "Y volver a empezar." },
      ], H - 310);
      break;
    case "ruido":
      drawPhoto(ctx, photos.crew, time, sceneT, sceneDur);
      drawLines(ctx, time, sceneT, [
        { text: "Tu tabla.", size: 120 },
        { text: "Tu ruido.", size: 120, color: RED_LIGHT },
      ], H - 300);
      break;
    case "flash":
      drawFlash(ctx, time, sceneT, photos);
      break;
    case "reveal":
      drawReveal(ctx, time, sceneT);
      break;
  }

  drawOverlays(ctx, time, noise, staticOverlay);

  // corte duro: frame negro de 40ms en cada cambio de escena
  if (sceneT < 40 && scene.id !== "static") {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);
  }
}

/* ---------- página ---------- */

export default function Promo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photosRef = useRef<PhotoMap | null>(null);
  const noiseRef = useRef<HTMLCanvasElement[]>([]);
  const staticOverlayRef = useRef<HTMLCanvasElement | null>(null);
  const startRef = useRef<number>(performance.now());
  const rafRef = useRef<number>(0);

  const [ready, setReady] = useState(false);
  const [showGuides, setShowGuides] = useState(false);
  const [recording, setRecording] = useState(false);
  const [progress, setProgress] = useState(0);

  // Refs de estado "en vivo" para el loop de rAF. `recordingRef` se
  // actualiza de forma SÍNCRONA (no vía render de React) para que la
  // grabación nunca alcance a incluir un frame con las guías puestas.
  const showGuidesRef = useRef(false);
  const recordingRef = useRef(false);

  useEffect(() => {
    showGuidesRef.current = showGuides;
  }, [showGuides]);

  // carga de imágenes + precálculo de variantes oscuras y overlay estático
  useEffect(() => {
    let alive = true;
    const entries = Object.entries(IMG_SOURCES) as [keyof PhotoMap, string][];
    Promise.all(
      entries.map(
        ([key, src]) =>
          new Promise<[keyof PhotoMap, HTMLImageElement]>((res, rej) => {
            const img = new Image();
            img.onload = () => res([key, img]);
            img.onerror = rej;
            img.src = src;
          })
      )
    ).then((loaded) => {
      if (!alive) return;
      const photos = Object.fromEntries(
        loaded.map(([key, img]) => [key, { img, dark: makeDarkVariant(img) }])
      ) as PhotoMap;
      photosRef.current = photos;
      noiseRef.current = makeNoiseTiles();
      staticOverlayRef.current = makeStaticOverlay();
      setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  // loop de render
  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const loop = () => {
      const t = performance.now() - startRef.current;
      drawFrame(ctx, t, photosRef.current!, noiseRef.current, staticOverlayRef.current!);
      if (showGuidesRef.current && !recordingRef.current) {
        // guías del recorte 9:16 (solo preview — recordingRef garantiza
        // que nunca se cuelen en el video grabado, ni siquiera en el
        // primer frame antes de que React re-renderice)
        ctx.save();
        ctx.strokeStyle = "rgba(255,255,255,0.55)";
        ctx.setLineDash([14, 10]);
        ctx.lineWidth = 3;
        ctx.strokeRect(CENTER_X, 0, CENTER_W, H);
        ctx.font = `400 24px "Courier New", monospace`;
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.textAlign = "center";
        ctx.fillText("ZONA SEGURA 9:16", W / 2, 40);
        ctx.restore();
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [ready]);

  const download = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || recordingRef.current) return;

    // Se prioriza VP9/WebM: el encoder de hardware que Chrome usa para
    // mux directo a mp4/avc1 en MediaRecorder suele ignorar
    // videoBitsPerSecond y produce archivos de menor calidad. VP9 por
    // software sí respeta el bitrate pedido — clave para contenido con
    // grano/ruido de pantalla completa como este.
    const vp9 = "video/webm;codecs=vp9";
    const avc1 = "video/mp4;codecs=avc1";
    const mime = MediaRecorder.isTypeSupported(vp9)
      ? vp9
      : MediaRecorder.isTypeSupported(avc1)
        ? avc1
        : "video/mp4";
    const ext = mime.startsWith("video/webm") ? "webm" : "mp4";

    const stream = canvas.captureStream(30);
    const rec = new MediaRecorder(stream, {
      mimeType: mime,
      // Bitrate alto a propósito: el grano/estática de pantalla completa
      // es contenido de alta frecuencia, muy caro de comprimir. Con menos
      // bitrate esto se ve blocky justo donde más se nota (fotos y texto).
      videoBitsPerSecond: 32_000_000,
    });
    const chunks: Blob[] = [];
    rec.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    rec.onstop = () => {
      const blob = new Blob(chunks, { type: mime.split(";")[0] });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `crumbskate-promo-agosto2026.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
      recordingRef.current = false;
      setRecording(false);
      setProgress(0);
    };

    // reinicia el video desde 0 y graba exactamente un loop completo.
    // recordingRef se marca ANTES que nada más, en el mismo tick, para
    // que el loop de rAF nunca dibuje las guías durante la captura.
    recordingRef.current = true;
    setRecording(true);
    startRef.current = performance.now();
    rec.start();

    const int = setInterval(() => {
      setProgress(Math.min(1, (performance.now() - startRef.current) / DURATION));
    }, 200);

    setTimeout(() => {
      clearInterval(int);
      rec.stop();
      stream.getTracks().forEach((tr) => tr.stop());
    }, DURATION + 150);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-black px-4 py-8">
      <div className="relative w-full max-w-5xl overflow-hidden border-4 border-black shadow-brutal-neon">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="block h-auto w-full bg-black"
          aria-label="Video promocional de CrumbSkate: lanzamiento agosto 2026"
        />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <span className="font-mono text-sm uppercase tracking-widest text-white/60">
              Cargando material&hellip;
            </span>
          </div>
        )}
        {recording && (
          <div className="absolute left-0 right-0 top-0 z-10 h-1.5 bg-white/20">
            <div
              className="h-full bg-red-600 transition-[width] duration-200 ease-linear"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={download}
          disabled={!ready || recording}
          className="border-brutal border-black bg-[#8B1A1A] px-6 py-3 font-impact text-lg uppercase tracking-wide text-white shadow-brutal transition-transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          {recording ? `Grabando\u2026 ${Math.round(progress * 100)}%` : "Descargar video"}
        </button>
        <button
          type="button"
          onClick={() => setShowGuides((v) => !v)}
          disabled={recording}
          className="border-brutal border-black bg-white px-6 py-3 font-impact text-lg uppercase tracking-wide text-black shadow-brutal transition-transform hover:-translate-y-0.5 disabled:opacity-50"
        >
          {showGuides ? "Ocultar zona 9:16" : "Ver zona 9:16"}
        </button>
      </div>

      <div className="max-w-xl text-center">
        <p className="font-mono text-[11px] uppercase leading-relaxed tracking-widest text-white/40 text-pretty">
          16:9 center-safe &mdash; recorta a 9:16 sin perder nada &mdash; el video
          exporta sin audio: móntale el bajo distorsionado a 120 BPM en tu editor,
          los cortes ya caen en el beat.
        </p>
      </div>
    </main>
  );
}