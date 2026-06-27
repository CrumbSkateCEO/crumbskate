import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIAS = ['Remeras', 'Buzos', 'Gorras', 'Medias', 'Bolsos', 'Accesorios'];

const CONFIG_INICIAL = [
  { clave: 'costo_envio', valor: '5000' },
  { clave: 'youtube_url', valor: 'https://youtube.com/@crumbskate' },
  { clave: 'email_contacto', valor: 'contacto@crumbskate.com' },
  { clave: 'instagram_url', valor: 'https://instagram.com/crumbskate' },
  { clave: 'envio_gratis_desde', valor: '50000' },
  { clave: 'moneda', valor: 'ARS' },
  { clave: 'mensaje_home', valor: '¡Bienvenidos a CrumbSkate!' },
];

async function main() {
  for (const nombre of CATEGORIAS) {
    const existe = await prisma.categoria.findFirst({ where: { nombre } });
    if (!existe) {
      await prisma.categoria.create({ data: { nombre, descripcion: 'Categoría base' } });
    }
  }

  for (const { clave, valor } of CONFIG_INICIAL) {
    await prisma.configuracion.upsert({
      where: { clave },
      create: { clave, valor },
      update: {},
    });
  }

  console.log('Seed completado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
