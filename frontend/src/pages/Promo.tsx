import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ============================================================
   CRUMBSKATE — PROMO REEL 9:16
   Publicidad animada tipo reel/TikTok para el lanzamiento.
   Tap para pausar/reanudar. Loop infinito.
   ============================================================ */

// Duración de cada escena en ms
const SCENES = [
  { id: "static", duration: 2600 },
  { id: "calle", duration: 4200 },
  { id: "diy", duration: 4200 },
  { id: "crew", duration: 4200 },
  { id: "hype", duration: 3400 },
  { id: "reveal", duration: 6400 },
] as const;

type SceneId = (typeof SCENES)[number]["id"];

const RED = "#8B1A1A";

/* ---------- Overlays de camcorder ---------- */

function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-40 opacity-[0.12] mix-blend-screen"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

function Scanlines() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-40 opacity-20"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.55) 3px, transparent 4px)",
      }}
    />
  );
}

function CamcorderHUD({ playing }: { playing: boolean }) {
  const [time, setTime] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setTime((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, [playing]);

  const mm = String(Math.floor(time / 60)).padStart(2, "0");
  const ss = String(time % 60).padStart(2, "0");

  return (
    <div className="pointer-events-none absolute inset-0 z-50 font-mono text-[11px] tracking-widest text-white/90">
      {/* REC */}
      <div className="absolute left-4 top-4 flex items-center gap-2">
        <motion.span
          className="block h-2.5 w-2.5 rounded-full bg-red-600"
          animate={{ opacity: playing ? [1, 0.1, 1] : 0.3 }}
          transition={{ duration: 1.1, repeat: Infinity }}
        />
        <span>{playing ? "REC" : "PAUSE"}</span>
      </div>
      {/* Timestamp */}
      <div className="absolute right-4 top-4">00:{mm}:{ss}</div>
      {/* Fecha estilo MiniDV */}
      <div className="absolute bottom-4 left-4">AGO. 2026 &nbsp;PM 11:47</div>
      <div className="absolute bottom-4 right-4">SP&nbsp;MiniDV</div>
      {/* Esquinas de viewfinder */}
      {["left-3 top-8 border-l-2 border-t-2", "right-3 top-8 border-r-2 border-t-2", "left-3 bottom-8 border-l-2 border-b-2", "right-3 bottom-8 border-r-2 border-b-2"].map((c) => (
        <span key={c} className={`absolute h-5 w-5 border-white/60 ${c}`} />
      ))}
    </div>
  );
}

/* ---------- Barra de progreso tipo stories ---------- */

function ProgressBar({ current, playing }: { current: number; playing: boolean }) {
  return (
    <div className="absolute left-0 right-0 top-0 z-50 flex gap-1 p-2">
      {SCENES.map((s, i) => (
        <div key={s.id} className="h-0.5 flex-1 overflow-hidden bg-white/25">
          {i < current && <div className="h-full w-full bg-white" />}
          {i === current && (
            <motion.div
              key={`${s.id}-${current}`}
              className="h-full bg-white"
              initial={{ width: "0%" }}
              animate={{ width: playing ? "100%" : undefined }}
              transition={{ duration: s.duration / 1000, ease: "linear" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------- Texto con glitch ---------- */

function GlitchText({ children, className = "" }: { children: string; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <motion.span
        aria-hidden
        className="absolute inset-0 z-0 text-[#8B1A1A]"
        animate={{ x: [-3, 2, -1, 3, 0], opacity: [0.9, 0.4, 0.9, 0.5, 0.9] }}
        transition={{ duration: 0.35, repeat: Infinity, repeatDelay: 1.4 }}
      >
        {children}
      </motion.span>
      <motion.span
        aria-hidden
        className="absolute inset-0 z-0 text-white/70"
        animate={{ x: [2, -3, 1, -2, 0], opacity: [0.5, 0.8, 0.3, 0.7, 0.5] }}
        transition={{ duration: 0.35, repeat: Infinity, repeatDelay: 1.9 }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* ---------- Cinta marquee ---------- */

function Tape({ text, reverse = false, className = "" }: { text: string; reverse?: boolean; className?: string }) {
  const row = Array(8).fill(text).join(" // ");
  return (
    <div className={`overflow-hidden whitespace-nowrap border-y-2 border-black bg-[#8B1A1A] py-1.5 ${className}`}>
      <div className={`inline-block font-impact text-sm uppercase tracking-[0.25em] text-white ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}>
        <span>{`${row} // ${row}`}</span>
      </div>
    </div>
  );
}

/* ---------- Escena con foto de fondo ---------- */

function PhotoScene({
  img,
  alt,
  kicker,
  line1,
  line2,
  tape,
}: {
  img: string;
  alt: string;
  kicker: string;
  line1: string;
  line2: string;
  tape: string;
}) {
  return (
    <div className="absolute inset-0">
      <motion.img
        src={img}
        alt={alt}
        className="h-full w-full object-cover"
        initial={{ scale: 1.18 }}
        animate={{ scale: 1 }}
        transition={{ duration: 4.5, ease: "easeOut" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 pb-24">
        <motion.p
          className="font-mono text-xs uppercase tracking-[0.35em] text-[#ff6b5e]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {kicker}
        </motion.p>
        <motion.h2
          className="font-impact text-5xl uppercase leading-[0.95] text-white text-balance"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 90 }}
        >
          {line1}
        </motion.h2>
        <motion.h2
          className="font-impact text-5xl uppercase leading-[0.95] text-[#c93a3a] text-balance"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 90 }}
        >
          {line2}
        </motion.h2>
      </div>
      <motion.div
        className="absolute bottom-10 left-0 right-0 -rotate-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        <Tape text={tape} />
      </motion.div>
    </div>
  );
}

/* ---------- Escenas ---------- */

function SceneStatic() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black">
      {/* Ruido de TV */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='s'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23s)'/%3E%3C/svg%3E\")",
        }}
        animate={{ opacity: [0.45, 0.2, 0.5, 0.15, 0.4] }}
        transition={{ duration: 0.4, repeat: Infinity }}
      />
      <motion.p
        className="relative z-10 px-8 text-center font-impact text-4xl uppercase leading-tight text-white"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 1, 0.4, 1], scale: 1 }}
        transition={{ duration: 0.9, delay: 0.5 }}
      >
        <GlitchText>NADIE PIDIÓ PERMISO.</GlitchText>
      </motion.p>
    </div>
  );
}

function SceneHype() {
  const words = ["AUTENTICIDAD", "RESISTENCIA", "COMUNIDAD"];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((v) => (v + 1) % words.length), 950);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="absolute inset-0">
      <img src="/promo/concrete-texture.png" alt="Textura de concreto rayado" className="h-full w-full object-cover opacity-50" />
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          <motion.p
            key={idx}
            className="px-4 text-center font-impact text-6xl uppercase text-white"
            initial={{ opacity: 0, scale: 1.6, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.28 }}
          >
            <GlitchText>{words[idx]}</GlitchText>
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

function SceneReveal() {
  return (
    <div className="absolute inset-0 bg-[#110C0C]">
      {/* Cintas superiores e inferiores */}
      <div className="absolute left-0 right-0 top-9 rotate-2">
        <Tape text="CRUMBSKATE" />
      </div>
      <div className="absolute bottom-9 left-0 right-0 -rotate-2">
        <Tape text="AGOSTO 2026" reverse />
      </div>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 px-6 py-32 text-center">
        <motion.p
          className="font-mono text-xs uppercase tracking-[0.4em] text-[#ff6b5e]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          De la calle. Para la calle.
        </motion.p>

        <motion.h1
          className="font-impact text-7xl uppercase leading-none text-white"
          initial={{ opacity: 0, scale: 1.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 120, damping: 12 }}
        >
          <GlitchText>CRUMB</GlitchText>
          <br />
          <GlitchText className="text-[#c93a3a]">SKATE</GlitchText>
        </motion.h1>

        <motion.div
          className="border-brutal border-black bg-[#8B1A1A] px-6 py-3 shadow-brutal"
          initial={{ opacity: 0, y: 30, rotate: -4 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 150 }}
        >
          <p className="font-impact text-3xl uppercase tracking-wide text-white">
            AGOSTO 2026
          </p>
        </motion.div>

        <motion.p
          className="font-mono text-sm uppercase tracking-[0.3em] text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.4, 1] }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          Próximamente &mdash; @crumbskate
        </motion.p>

        <motion.p
          className="max-w-xs font-mono text-[11px] leading-relaxed text-white/50 text-pretty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.3 }}
        >
          No es una tienda. Es la esquina donde se junta la crew.
        </motion.p>
      </div>
    </div>
  );
}

function Scene({ id }: { id: SceneId }) {
  switch (id) {
    case "static":
      return <SceneStatic />;
    case "calle":
      return (
        <PhotoScene
          img="/promo/skater-grind.png"
          alt="Skater haciendo grind en un borde de concreto"
          kicker="Bautismo de concreto"
          line1="La calle no es perfecta."
          line2="Nosotros tampoco."
          tape="Lo crudo es real"
        />
      );
    case "diy":
      return (
        <PhotoScene
          img="/promo/deck-diy.png"
          alt="Tabla de skate gastada apoyada en una pared con graffiti"
          kicker="Hazlo tú mismo"
          line1="Agarra las migajas."
          line2="Arma algo real."
          tape="DIY o nada"
        />
      );
    case "crew":
      return (
        <PhotoScene
          img="/promo/crew-night.png"
          alt="Crew de skaters reunida de noche bajo una luz de calle"
          kicker="Familia elegida"
          line1="Nadie patina solo."
          line2="La crew es familia."
          tape="La esquina nos espera"
        />
      );
    case "hype":
      return <SceneHype />;
    case "reveal":
      return <SceneReveal />;
  }
}

/* ---------- Página principal ---------- */

export default function Promo() {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      setSceneIdx((v) => {
        if (v + 1 >= SCENES.length) {
          setCycle((c) => c + 1);
          return 0;
        }
        return v + 1;
      });
    }, SCENES[sceneIdx].duration);
    return () => clearTimeout(t);
  }, [sceneIdx, playing, cycle]);

  const togglePlay = useCallback(() => setPlaying((p) => !p), []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-black py-4">
      <div className="flex flex-col items-center gap-3">
        {/* Frame 9:16 */}
        <div
          role="button"
          tabIndex={0}
          aria-label={playing ? "Pausar publicidad" : "Reproducir publicidad"}
          onClick={togglePlay}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              togglePlay();
            }
          }}
          className="relative aspect-[9/16] h-[min(92vh,800px)] cursor-pointer select-none overflow-hidden border-4 border-black bg-black shadow-brutal-neon"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${SCENES[sceneIdx].id}-${cycle}`}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <Scene id={SCENES[sceneIdx].id} />
            </motion.div>
          </AnimatePresence>

          <Scanlines />
          <GrainOverlay />
          <CamcorderHUD playing={playing} />
          <ProgressBar current={sceneIdx} playing={playing} />

          {!playing && (
            <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/40">
              <div className="border-brutal border-black bg-white px-6 py-3 shadow-brutal">
                <span className="font-impact text-2xl uppercase text-black">Pausado</span>
              </div>
            </div>
          )}
        </div>

        <p className="font-mono text-[11px] uppercase tracking-widest text-white/40">
          Formato reel 9:16 &mdash; tap para pausar &mdash; graba la pantalla para publicar
        </p>
      </div>
    </main>
  );
}
