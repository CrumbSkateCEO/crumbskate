import nodemailer from 'nodemailer';

function isMailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function createTransport() {
  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE === 'true' || port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendMail(to: string, subject: string, html: string): Promise<void> {
  if (!isMailConfigured()) {
    console.warn('[mail] SMTP no configurado. Email no enviado a:', to);
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[mail] Contenido (dev):', subject);
    }
    return;
  }

  const from = process.env.EMAIL_FROM || 'CrumbSkate <noreply@crumbskate.com>';
  await createTransport().sendMail({ from, to, subject, html });
}
