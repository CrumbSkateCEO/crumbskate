import prisma from '../config/db';

const CATEGORIAS = ['Remeras', 'Buzos', 'Gorras', 'Medias', 'Bolsos', 'Accesorios'];

async function seedCategorias() {
  for (const nombre of CATEGORIAS) {
    const existe = await prisma.categoria.findFirst({ where: { nombre } });
    if (!existe) {
      await prisma.categoria.create({ data: { nombre, descripcion: 'Categoría base' } });
      console.log(`Categoría creada: ${nombre}`);
    }
  }
}

seedCategorias()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
