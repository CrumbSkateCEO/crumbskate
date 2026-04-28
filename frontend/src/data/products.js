const baseComments = [
  {
    id: 1,
    user: "santi_oliva",
    date: "hace 2 días",
    text: "Muy buena calidad, el producto cumplió con lo esperado.",
    rating: 5,
    helpfulYes: 12,
    helpfulNo: 1,
  },
  {
    id: 2,
    user: "valen.perez",
    date: "hace 4 días",
    text: "Llegó rápido y el calce me resultó cómodo.",
    rating: 4,
    helpfulYes: 7,
    helpfulNo: 0,
  },
  {
    id: 3,
    user: "nico_skate",
    date: "hace 1 semana",
    text: "Buen producto para uso diario, lo volvería a comprar.",
    rating: 4,
    helpfulYes: 4,
    helpfulNo: 2,
  },
];

const getSizesByCategory = (category) => {
  if (category === "remeras") return ["XS", "S", "M", "L", "XL", "XXL"];
  if (category === "buzos") return ["S", "M", "L", "XL"];
  if (category === "gorras") return ["Único"];
  if (category === "medias") return ["35-38", "39-42", "43-46"];
  if (category === "bolsos") return ["Único"];
  return ["Único"];
};

const baseProducts = [
  {
    id: "1",
    name: "Remera Crumb Classic",
    price: 12990,
    category: "remeras",
    brand: "Crumb Skate",
    inStock: true,
  },
  {
    id: "2",
    name: "Buzo Crumbskate Gris",
    price: 24990,
    category: "buzos",
    brand: "Crumb Skate",
    inStock: true,
  },
  {
    id: "3",
    name: "Gorra Crumb Skate",
    price: 8990,
    category: "gorras",
    brand: "Crumb Skate",
    stockInfo: "¡Últimas unidades!",
    inStock: true,
  },
  {
    id: "4",
    name: "Medias Estampadas",
    price: 3490,
    category: "medias",
    brand: "Crumb Skate",
    inStock: true,
  },
  {
    id: "5",
    name: "Bolso Crumbskate Negro",
    price: 18990,
    category: "bolsos",
    brand: "Crumb Skate",
    inStock: true,
  },
  {
    id: "6",
    name: "Accesorios Skater Pack",
    price: 5990,
    category: "accesorios",
    brand: "Crumb Skate",
    stockLimitado: true,
    inStock: true,
  },
  {
    id: "7",
    name: "Remera Thrasher Style",
    price: 13990,
    category: "remeras",
    brand: "Crumb Skate",
    inStock: false,
  },
  {
    id: "8",
    name: "Buzo Santa Cruz",
    price: 26990,
    category: "buzos",
    brand: "Santa Cruz x Crumb",
    inStock: true,
  },
];

export const products = baseProducts.map((product) => ({
  ...product,
  oldPrice: Math.round(product.price * 1.25),
  sizes: getSizesByCategory(product.category),
  description: `${product.name} de estilo urbano con diseño inspirado en la cultura skate. Confeccionado con materiales resistentes para uso diario y sesiones de calle.`,
  comments: baseComments.map((comment, index) => ({
    ...comment,
    id: Number(`${product.id}${index + 1}`),
  })),
}));

export const categories = [
  { id: "todos", name: "Todos" },
  { id: "remeras", name: "Remeras" },
  { id: "buzos", name: "Buzos" },
  { id: "gorras", name: "Gorras" },
  { id: "medias", name: "Medias" },
  { id: "bolsos", name: "Bolsos" },
  { id: "accesorios", name: "Accesorios" },
];
