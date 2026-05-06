import { useState } from "react";

import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { categories } from "../data/products";

const Home = () => {
  const { products } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const { addToCart, cartItems } = useCart();


  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  const filteredProducts =
    selectedCategory === "todos"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-12 select-none cursor-default">
      {/* Hero Section */}
      <section className="hero bg-base-200 min-h-[500px] overflow-hidden relative w-screen ml-[calc(50%-50vw)] py-20 flex flex-col items-center justify-center">
        {/* Decoraciones de fondo */}

        {/* Bola 8 */}
        <div className="absolute top-12 left-6 md:top-24 md:left-24 w-28 h-28 md:w-40 md:h-40 bg-neutral rounded-full flex items-center justify-center shadow-xl transform -rotate-12 hover:scale-110 transition-transform duration-500 z-0 opacity-90 border-4 border-neutral-content/10">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center">
            <span className="text-neutral text-5xl md:text-6xl font-black">
              8
            </span>
          </div>
        </div>

        {/* T-Shirt SVG Replacing Image - Bottom Right */}
        <div className="absolute bottom-12 right-6 md:bottom-24 md:right-24 w-32 h-32 md:w-48 md:h-48 bg-base-100 rounded-xl shadow-xl transform rotate-6 hover:-rotate-3 hover:scale-110 transition-all duration-500 z-0 p-4 md:p-6 border-4 border-base-300 text-primary flex items-center justify-center group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
          <svg
            className="w-full h-full drop-shadow-md group-hover:drop-shadow-[0_0_15px_rgba(255,140,0,0.5)] transition-all z-10"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="none"
          >
            <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
          </svg>
        </div>

        <div className="relative z-10 w-full flex justify-center mt-[-2rem]">
          <div className="bg-primary text-primary-content py-10 px-10 md:py-16 md:px-32 transform -skew-x-12 shadow-2xl relative w-full max-w-4xl flex items-center justify-center border-b-8 border-primary/50">
            <div className="transform skew-x-12 flex flex-col items-center gap-3">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase whitespace-nowrap drop-shadow-lg">
                Crumb Skate!
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-base-200 p-8 rounded-xl text-center shadow-lg hover:shadow-xl transition-all border border-neutral/50">
          <p className="text-lg font-bold text-base-content">
            100% Indumentaria Skater
          </p>
          <p className="text-sm text-base-content/70 mt-2">
            Diseños exclusivos y durabilidad
          </p>
        </div>
        <div className="bg-base-200 p-8 rounded-xl text-center shadow-lg hover:shadow-xl transition-all border border-neutral/50">
          <p className="text-lg font-bold text-base-content">Compra Segura</p>
          <p className="text-sm text-base-content/70 mt-2">
            Transacciones vía Mercado Libre
          </p>
        </div>
        <div className="bg-base-200 p-8 rounded-xl text-center shadow-lg hover:shadow-xl transition-all border border-neutral/50">
          <p className="text-lg font-bold text-base-content">
            Envíos a todo el país
          </p>
          <p className="text-sm text-base-content/70 mt-2">
            Llegamos a cada rincón de Argentina
          </p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl md:text-4xl font-black text-base-content uppercase tracking-tight">
            Categorías
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`btn btn-sm md:btn-md font-bold transition-all uppercase tracking-wider text-xs md:text-sm border-0 ${
                selectedCategory === category.id
                  ? "bg-primary text-primary-content shadow-[0_0_15px_rgba(255,140,0,0.4)]"
                  : "bg-base-200 text-base-content/70 hover:text-neutral-content hover:bg-neutral"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-black text-primary dark:text-[#ff6b6b] uppercase tracking-tighter border-b-2 border-primary dark:border-[#ff6b6b] pb-2 inline-block">
          {selectedCategory === "todos"
            ? "Catálogo Completo"
            : `${categories.find((c) => c.id === selectedCategory)?.name}`.toUpperCase()}
        </h2>

        <div className="-mx-2 sm:-mx-4 md:-mx-6 bg-primary py-10 px-4 sm:px-8 md:px-12 relative shadow-inner">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  isAdded={cartItems.some(item => item.id === product.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-base-100 rounded-xl shadow-lg">
              <p className="text-xl font-bold text-base-content/70">
                No hay productos en esta categoría
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-base-200 p-10 md:p-16 flex flex-col items-center justify-center text-center space-y-6 -mx-2 sm:-mx-4 md:-mx-6">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-primary dark:text-[#ff6b6b]">
          Mantenete al día
        </h2>
        <p className="text-lg text-base-content/70 max-w-2xl">
          Recibe las últimas novedades, colecciones exclusivas y notificaciones
          sobre nuevos lanzamientos de Crumbskate.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xl mt-6">
          <input
            type="email"
            placeholder="Introduce tu email..."
            className="input input-bordered input-lg flex-1 bg-white dark:bg-base-100 text-neutral dark:text-base-content placeholder:text-neutral/40 dark:placeholder:text-neutral-content border-neutral/40 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
          <button className="btn btn-lg bg-primary hover:bg-neutral text-primary-content font-black uppercase tracking-wider border-0 shadow-lg rounded-sm">
            Suscribirse
          </button>
        </div>
      </section>

      {/* Qué estás buscando */}
      <section className="bg-base-100 p-8 md:p-12 border-t border-neutral/20 text-center">
        <h2 className="text-2xl md:text-3xl font-black text-primary dark:text-[#ff6b6b] mb-10 uppercase tracking-tighter">
          ¿Qué estás buscando?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-4xl mx-auto">
          <div>
            <h3 className="text-lg font-black text-base-content uppercase tracking-widest mb-4">
              Femenino
            </h3>
            <ul className="space-y-3 text-sm font-bold text-base-content/60 uppercase tracking-widest">
              <li>
                <a
                  href="#"
                  className="hover:text-primary dark:hover:text-[#ff6b6b] transition-colors"
                >
                  Remeras
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary dark:hover:text-[#ff6b6b] transition-colors"
                >
                  Pantalones
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary dark:hover:text-[#ff6b6b] transition-colors"
                >
                  Gorras
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary dark:hover:text-[#ff6b6b] transition-colors"
                >
                  Zapatillas
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary dark:hover:text-[#ff6b6b] transition-colors"
                >
                  Bolsos
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-black text-base-content uppercase tracking-widest mb-4">
              Masculino
            </h3>
            <ul className="space-y-3 text-sm font-bold text-base-content/60 uppercase tracking-widest">
              <li>
                <a
                  href="#"
                  className="hover:text-primary dark:hover:text-[#ff6b6b] transition-colors"
                >
                  Remeras
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary dark:hover:text-[#ff6b6b] transition-colors"
                >
                  Pantalones
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary dark:hover:text-[#ff6b6b] transition-colors"
                >
                  Buzos
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary dark:hover:text-[#ff6b6b] transition-colors"
                >
                  Zapatillas
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary dark:hover:text-[#ff6b6b] transition-colors"
                >
                  Camisas
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-black text-base-content uppercase tracking-widest mb-4">
              Unisex
            </h3>
            <ul className="space-y-3 text-sm font-bold text-base-content/60 uppercase tracking-widest">
              <li>
                <a
                  href="#"
                  className="hover:text-primary dark:hover:text-[#ff6b6b] transition-colors"
                >
                  Medias
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary dark:hover:text-[#ff6b6b] transition-colors"
                >
                  Skates
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary dark:hover:text-[#ff6b6b] transition-colors"
                >
                  Gorras
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary dark:hover:text-[#ff6b6b] transition-colors"
                >
                  Accesorios
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary dark:hover:text-[#ff6b6b] transition-colors"
                >
                  Lijas
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
