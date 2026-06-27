import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const nombre = process.env.ADMIN_NAME || 'Admin';

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL y ADMIN_PASSWORD son requeridos');
  }

  const hash = await bcrypt.hash(password, 10);

  const usuario = await prisma.usuario.upsert({
    where: { email },
    create: {
      nombre,
      email,
      password_hash: hash,
      rol: 'admin',
    },
    update: {
      nombre,
      password_hash: hash,
      rol: 'admin',
    },
  });

  console.log(`Usuario admin listo: ${usuario.email} (id ${usuario.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
