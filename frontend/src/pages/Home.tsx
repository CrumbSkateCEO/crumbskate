import { useState } from "react";
import { motion } from "framer-motion";

import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { categories } from "../data/products";

const sectionReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

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
    <div className="space-y-0 select-none cursor-default">
      {/* Hero Section */}
      <section className="bg-base-300 overflow-hidden relative w-screen ml-[calc(50%-50vw)] border-b-4 border-black">
        {/* Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(139,26,26,0.15) 3px, rgba(139,26,26,0.15) 6px)",
          }}
        />

        {/* Desktop decorative elements — hidden on mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
          animate={{ opacity: 0.15, scale: 1, rotate: -12 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 150 }}
          className="hidden md:flex absolute top-16 left-12 lg:left-24 w-32 lg:w-40 h-32 lg:h-40 bg-black border-4 border-primary items-center justify-center shadow-brutal z-0"
        >
          <div className="w-16 lg:w-20 h-16 lg:h-20 bg-primary flex items-center justify-center">
            <span className="text-primary-content text-4xl lg:text-6xl font-impact">
              8
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: 20 }}
          animate={{ opacity: 0.15, scale: 1, rotate: 6 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            type: "spring",
            stiffness: 150,
          }}
          className="hidden md:flex absolute bottom-16 right-12 lg:right-24 w-32 lg:w-44 h-32 lg:h-44 bg-base-200 border-4 border-primary shadow-brutal z-0 p-5 text-base-content items-center justify-center"
        >
          <svg
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="none"
          >
            <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
          </svg>
        </motion.div>

        {/* Main hero content */}
        <div className="relative z-10 flex flex-col items-center px-4 py-10 sm:py-16 md:py-24 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-primary text-primary-content py-6 px-6 sm:py-10 sm:px-14 md:py-14 md:px-28 md:-skew-x-6 relative w-full max-w-3xl lg:max-w-4xl border-4 border-black shadow-brutal"
          >
            <div className="md:skew-x-6 flex flex-col items-center text-center gap-3 sm:gap-4">
              <p className="font-mono text-[9px] sm:text-[10px] md:text-xs tracking-[0.3em] sm:tracking-[0.5em] uppercase opacity-60">
                Cultura Urbana Argentina
              </p>
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-impact tracking-[0.05em] sm:tracking-[0.1em] uppercase leading-[0.9]">
                CRUMB
                <br className="sm:hidden" /> SKATE!
              </h1>
              <p className="font-mono text-[10px] sm:text-xs md:text-sm text-primary-content/70 max-w-lg tracking-wider leading-relaxed mt-1">
                Ropa, zapatillas y accesorios de skate. Diseños exclusivos con
                envío a todo el país.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 w-full sm:w-auto">
                <a
                  href="#catalogo"
                  className="bg-black text-white font-impact uppercase tracking-[0.2em] px-8 py-3 text-xs border-2 border-black hover:bg-white hover:text-black transition-all text-center"
                >
                  Ver catálogo
                </a>
                <a
                  href="#newsletter"
                  className="bg-transparent text-primary-content font-impact uppercase tracking-[0.2em] px-8 py-3 text-xs border-2 border-primary-content/40 hover:bg-primary-content/10 transition-all text-center"
                >
                  Novedades
                </a>
              </div>
            </div>
          </motion.div>

          {/* Quick info badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 md:mt-10 max-w-3xl"
          >
            {[
              { icon: "✦", text: "Indumentaria 100% Skater" },
              { icon: "✦", text: "Compra Segura vía MercadoLibre" },
              { icon: "✦", text: "Envíos a todo el país" },
            ].map((item, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 bg-base-200 border-2 border-black px-3 py-1.5 md:px-4 md:py-2 text-[10px] sm:text-xs font-mono font-bold text-base-content uppercase tracking-wider hover:bg-primary hover:text-primary-content hover:border-black transition-all cursor-default"
              >
                <span className="text-primary group-hover:text-primary-content">
                  {item.icon}
                </span>
                {item.text}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="space-y-6 pt-12"
        id="catalogo"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-impact text-base-content uppercase tracking-[0.1em] sm:tracking-[0.2em]">
            Categorías
          </h2>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-2 sm:px-4 md:px-6 md:py-3 font-impact transition-all uppercase tracking-[0.1em] sm:tracking-[0.15em] text-[11px] sm:text-xs md:text-sm border-2 border-black rounded-none ${
                selectedCategory === category.id
                  ? "bg-primary text-primary-content shadow-brutal-sm"
                  : "bg-base-200 text-base-content/70 hover:text-primary-content hover:bg-primary"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </motion.section>

      {/* Featured Products */}
      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="space-y-4 pt-8"
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-impact text-base-content uppercase tracking-[0.1em] sm:tracking-[0.2em] border-b-4 border-primary pb-2 inline-block">
          {selectedCategory === "todos"
            ? "Catálogo Completo"
            : `${categories.find((c) => c.id === selectedCategory)?.name}`.toUpperCase()}
        </h2>

        <div className="-mx-4 sm:-mx-4 md:-mx-6 bg-base-300 py-6 sm:py-10 px-3 sm:px-8 md:px-12 relative border-y-4 border-black">
          {/* Diagonal stripes background */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(139,26,26,0.2) 10px, rgba(139,26,26,0.2) 12px)",
            }}
          />

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 relative z-10">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  isAdded={cartItems.some((item) => item.id === product.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-base-200 border-4 border-black shadow-brutal relative z-10">
              <p className="text-xl font-impact text-base-content/70 tracking-wider uppercase">
                No hay productos en esta categoría
              </p>
            </div>
          )}
        </div>
      </motion.section>

      {/* Newsletter Section */}
      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="bg-base-200 p-6 sm:p-10 md:p-16 flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6 -mx-4 sm:-mx-4 md:-mx-6 border-y-4 border-primary relative overflow-hidden"
        id="newsletter"
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(139,26,26,0.3) 10px, rgba(139,26,26,0.3) 12px)",
          }}
        />
        <div className="relative z-10 flex flex-col items-center space-y-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-impact uppercase tracking-[0.15em] sm:tracking-[0.3em] text-base-content">
            Mantenete al día
          </h2>
          <p className="text-sm font-mono text-base-content/50 max-w-2xl tracking-wider">
            Recibe las últimas novedades, colecciones exclusivas y
            notificaciones sobre nuevos lanzamientos de Crumbskate.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xl mt-6">
            <input
              type="email"
              placeholder="TU@EMAIL.COM"
              className="flex-1 bg-base-300 border-2 border-primary/30 focus:border-primary text-base-content placeholder:text-base-content/20 px-4 py-3 rounded-none font-mono text-sm tracking-wider transition-all outline-none"
            />
            <button className="bg-primary text-primary-content font-impact uppercase tracking-[0.2em] px-8 py-3 border-2 border-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all text-sm">
              Suscribirse
            </button>
          </div>
        </div>
      </motion.section>

      {/* Qué estás buscando */}
      <motion.section
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="bg-base-300 p-6 sm:p-8 md:p-12 border-t-4 border-black text-center -mx-4 sm:-mx-4 md:-mx-6"
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-impact text-base-content mb-6 sm:mb-10 uppercase tracking-[0.15em] sm:tracking-[0.3em]">
          ¿Qué estás buscando?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-4xl mx-auto">
          <div>
            <h3 className="text-lg font-impact text-warning uppercase tracking-[0.3em] mb-4">
              Femenino
            </h3>
            <ul className="space-y-3 text-xs font-mono font-bold text-base-content/40 uppercase tracking-[0.3em]">
              <li>
                <a
                  href="#"
                  className="hover:text-base-content transition-colors"
                >
                  Remeras
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-base-content transition-colors"
                >
                  Pantalones
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-base-content transition-colors"
                >
                  Gorras
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-base-content transition-colors"
                >
                  Zapatillas
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-base-content transition-colors"
                >
                  Bolsos
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-impact text-warning uppercase tracking-[0.3em] mb-4">
              Masculino
            </h3>
            <ul className="space-y-3 text-xs font-mono font-bold text-base-content/40 uppercase tracking-[0.3em]">
              <li>
                <a
                  href="#"
                  className="hover:text-base-content transition-colors"
                >
                  Remeras
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-base-content transition-colors"
                >
                  Pantalones
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-base-content transition-colors"
                >
                  Buzos
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-base-content transition-colors"
                >
                  Zapatillas
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-base-content transition-colors"
                >
                  Camisas
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-impact text-warning uppercase tracking-[0.3em] mb-4">
              Unisex
            </h3>
            <ul className="space-y-3 text-xs font-mono font-bold text-base-content/40 uppercase tracking-[0.3em]">
              <li>
                <a
                  href="#"
                  className="hover:text-base-content transition-colors"
                >
                  Medias
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-base-content transition-colors"
                >
                  Skates
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-base-content transition-colors"
                >
                  Gorras
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-base-content transition-colors"
                >
                  Accesorios
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-base-content transition-colors"
                >
                  Lijas
                </a>
              </li>
            </ul>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
