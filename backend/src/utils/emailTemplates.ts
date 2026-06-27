const BRAND = 'CRUMB SKATE';
const PRIMARY = '#8B1A1A';
const DARK = '#1a1a1a';
const LIGHT = '#EBEBEB';

function layout(content: string): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${BRAND}</title>
</head>
<body style="margin:0;padding:0;background:${DARK};font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${DARK};padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#252525;border:4px solid #000;box-shadow:8px 8px 0 ${PRIMARY};">
          <tr>
            <td style="background:${PRIMARY};padding:24px 28px;border-bottom:4px solid #000;">
              <p style="margin:0;font-size:28px;font-weight:900;letter-spacing:0.15em;color:#fff;text-transform:uppercase;">${BRAND}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px;color:${LIGHT};font-size:15px;line-height:1.6;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px;border-top:2px solid #333;text-align:center;">
              <p style="margin:0;font-size:11px;color:#888;letter-spacing:0.1em;text-transform:uppercase;">© ${new Date().getFullYear()} CrumbSkate · Skatewear argentino</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function resetPasswordEmail(nombre: string, resetUrl: string): { subject: string; html: string } {
  const content = `
    <p style="margin:0 0 16px;font-size:13px;letter-spacing:0.2em;text-transform:uppercase;color:#888;">Restablecer contraseña</p>
    <p style="margin:0 0 20px;">Hola <strong>${nombre}</strong>,</p>
    <p style="margin:0 0 24px;color:#ccc;">Recibimos una solicitud para restablecer la contraseña de tu cuenta. El enlace expira en <strong>1 hora</strong>.</p>
    <p style="margin:0 0 28px;text-align:center;">
      <a href="${resetUrl}" style="display:inline-block;background:${PRIMARY};color:#fff;text-decoration:none;padding:14px 32px;font-weight:900;letter-spacing:0.15em;text-transform:uppercase;border:2px solid #000;box-shadow:4px 4px 0 #000;">Nueva contraseña</a>
    </p>
    <p style="margin:0 0 12px;font-size:13px;color:#888;">Si el botón no funciona, copiá este enlace:</p>
    <p style="margin:0;word-break:break-all;font-size:12px;color:#aaa;">${resetUrl}</p>
    <p style="margin:24px 0 0;font-size:13px;color:#666;">Si no solicitaste este cambio, ignorá este email.</p>
  `;
  return {
    subject: `${BRAND} — Restablecer contraseña`,
    html: layout(content),
  };
}

export function newsletterWelcomeEmail(): { subject: string; html: string } {
  const content = `
    <p style="margin:0 0 16px;font-size:13px;letter-spacing:0.2em;text-transform:uppercase;color:#888;">Newsletter</p>
    <p style="margin:0 0 20px;">¡Gracias por suscribirte!</p>
    <p style="margin:0;color:#ccc;">Vas a recibir novedades, colecciones exclusivas y lanzamientos de CrumbSkate antes que nadie.</p>
  `;
  return {
    subject: `${BRAND} — Bienvenido al newsletter`,
    html: layout(content),
  };
}
