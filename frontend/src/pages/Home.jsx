import { useState } from "react";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("todos");

  // Mock de productos - Ropa y accesorios skater
  const products = [
    {
      id: 1,
      name: "Remera Crumb Classic",
      price: 1299,
      category: "remeras",
      image: "https://via.placeholder.com/300x200?text=Remera+Classic",
      rating: 4.8,
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    {
      id: 2,
      name: "Buzo Crumbskate Gris",
      price: 2499,
      category: "buzos",
      image: "https://via.placeholder.com/300x200?text=Buzo+Gris",
      rating: 4.9,
      sizes: ["S", "M", "L", "XL"],
    },
    {
      id: 3,
      name: "Gorra Crumb Skate",
      price: 899,
      category: "gorras",
      image: "https://via.placeholder.com/300x200?text=Gorra+Crumb",
      rating: 4.7,
      stockInfo: "¡Últimas unidades!",
    },
    {
      id: 4,
      name: "Medias Estampadas",
      price: 349,
      category: "medias",
      image: "https://via.placeholder.com/300x200?text=Medias",
      rating: 4.6,
    },
    {
      id: 5,
      name: "Bolso Crumbskate Negro",
      price: 1899,
      category: "bolsos",
      image: "https://via.placeholder.com/300x200?text=Bolso+Negro",
      rating: 4.8,
    },
    {
      id: 6,
      name: "Accesorios Skater Pack",
      price: 599,
      category: "accesorios",
      image: "https://via.placeholder.com/300x200?text=Accesorios+Pack",
      rating: 4.5,
      stockLimitado: true,
    },
    {
      id: 7,
      name: "Remera Thrasher Style",
      price: 1399,
      category: "remeras",
      image: "https://via.placeholder.com/300x200?text=Remera+Thrasher",
      rating: 4.9,
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    {
      id: 8,
      name: "Buzo Santa Cruz",
      price: 2699,
      category: "buzos",
      image: "https://via.placeholder.com/300x200?text=Santa+Cruz",
      rating: 4.8,
      sizes: ["S", "M", "L", "XL"],
    },
  ];

  const categories = [
    { id: "todos", name: "Todos" },
    { id: "remeras", name: "Remeras" },
    { id: "buzos", name: "Buzos" },
    { id: "gorras", name: "Gorras" },
    { id: "medias", name: "Medias" },
    { id: "bolsos", name: "Bolsos" },
    { id: "accesorios", name: "Accesorios" },
  ];

  const filteredProducts =
    selectedCategory === "todos"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="hero bg-base-200 min-h-[500px] overflow-hidden relative w-screen ml-[calc(50%-50vw)] py-20 flex flex-col items-center justify-center">
        {/* Decoraciones de fondo */}
        <div className="absolute top-12 left-6 md:top-24 md:left-24 w-28 h-28 md:w-40 md:h-40 bg-neutral rounded-full flex items-center justify-center shadow-xl transform -rotate-12 hover:scale-110 transition-transform duration-500 z-0 opacity-90 border-4 border-neutral-content/10">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center">
            <span className="text-neutral text-5xl md:text-6xl font-black">8</span>
          </div>
        </div>

        <div className="absolute bottom-12 right-6 md:bottom-24 md:right-24 w-32 h-32 md:w-48 md:h-48 bg-base-100 rounded-xl shadow-xl transform rotate-6 hover:rotate-0 hover:scale-110 transition-all duration-500 z-0 p-2 border-4 border-base-300">
          <img src="https://www.crosstheline.com.ar/products/remera-santa-cruz-copia" alt="Remera Skate" className="w-full h-full object-cover rounded-lg" />
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
          <p className="text-lg font-bold text-base-content">100% Indumentaria Skater</p>
          <p className="text-sm text-base-content/70 mt-2">Diseños exclusivos y durabilidad</p>
        </div>
        <div className="bg-base-200 p-8 rounded-xl text-center shadow-lg hover:shadow-xl transition-all border border-neutral/50">
          <p className="text-lg font-bold text-base-content">Compra Segura</p>
          <p className="text-sm text-base-content/70 mt-2">Transacciones vía Mercado Libre</p>
        </div>
        <div className="bg-base-200 p-8 rounded-xl text-center shadow-lg hover:shadow-xl transition-all border border-neutral/50">
          <p className="text-lg font-bold text-base-content">Envíos a todo el país</p>
          <p className="text-sm text-base-content/70 mt-2">Llegamos a cada rincón de Argentina</p>
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
              className={`btn btn-sm md:btn-md font-bold transition-all uppercase tracking-wider text-xs md:text-sm border-0 ${selectedCategory === category.id
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
                <div
                  key={product.id}
                  className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
                >
                  <figure className="h-56 overflow-hidden bg-neutral relative relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                    />
                    {/* Stock tag / Alertas */}
                    {product.stockLimitado && (
                      <div className="absolute top-3 right-3 badge badge-error font-bold text-white border-0 shadow-lg tracking-wide uppercase text-[10px]">
                        Sin Stock
                      </div>
                    )}
                    {product.stockInfo && !product.stockLimitado && (
                      <div className="absolute top-3 right-3 badge badge-error font-bold text-white border-0 shadow-lg tracking-wide uppercase text-[10px]">
                        {product.stockInfo}
                      </div>
                    )}
                  </figure>
                  <div className="card-body p-6">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="card-title text-xl text-base-content font-bold leading-tight">
                        {product.name}
                      </h3>
                    </div>

                    <p className="text-base-content/70 text-sm uppercase font-semibold tracking-wider mt-1">
                      {product.category}
                    </p>

                    {product.sizes && (
                      <div className="mt-4 pt-4 border-t border-neutral/30">
                        <span className="text-xs font-bold text-base-content/70 uppercase tracking-wider block mb-2">
                          Talles:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {product.sizes.map((size) => (
                            <span
                              key={size}
                              className="bg-neutral text-neutral-content text-xs font-bold px-2 py-1 rounded"
                            >
                              {size}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="card-actions justify-between items-end mt-auto pt-6">
                      <span className="text-2xl font-black text-base-content">
                        ${product.price}
                      </span>
                      <button className="btn bg-primary hover:bg-neutral text-primary-content font-black uppercase text-sm border-0 px-6 hover:shadow-lg transition-all rounded-sm w-full sm:w-auto">
                        Comprar
                      </button>
                    </div>
                  </div>
                </div>
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

      {/* Qué estás buscando */}
      <section className="bg-base-100 p-8 md:p-12 mt-12 border-t border-neutral/20 text-center">
        <h2 className="text-2xl md:text-3xl font-black text-primary dark:text-[#ff6b6b] mb-10 uppercase tracking-tighter">
          ¿Qué estás buscando?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-4xl mx-auto">
          <div>
            <h3 className="text-lg font-black text-base-content uppercase tracking-widest mb-4">Femenino</h3>
            <ul className="space-y-3 text-sm font-bold text-base-content/60 uppercase tracking-widest">
              <li><a href="#" className="hover:text-primary dark:hover:text-[#ff6b6b] transition-colors">Remeras</a></li>
              <li><a href="#" className="hover:text-primary dark:hover:text-[#ff6b6b] transition-colors">Pantalones</a></li>
              <li><a href="#" className="hover:text-primary dark:hover:text-[#ff6b6b] transition-colors">Gorras</a></li>
              <li><a href="#" className="hover:text-primary dark:hover:text-[#ff6b6b] transition-colors">Zapatillas</a></li>
              <li><a href="#" className="hover:text-primary dark:hover:text-[#ff6b6b] transition-colors">Bolsos</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-black text-base-content uppercase tracking-widest mb-4">Masculino</h3>
            <ul className="space-y-3 text-sm font-bold text-base-content/60 uppercase tracking-widest">
              <li><a href="#" className="hover:text-primary dark:hover:text-[#ff6b6b] transition-colors">Remeras</a></li>
              <li><a href="#" className="hover:text-primary dark:hover:text-[#ff6b6b] transition-colors">Pantalones</a></li>
              <li><a href="#" className="hover:text-primary dark:hover:text-[#ff6b6b] transition-colors">Buzos</a></li>
              <li><a href="#" className="hover:text-primary dark:hover:text-[#ff6b6b] transition-colors">Zapatillas</a></li>
              <li><a href="#" className="hover:text-primary dark:hover:text-[#ff6b6b] transition-colors">Camisas</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-black text-base-content uppercase tracking-widest mb-4">Unisex</h3>
            <ul className="space-y-3 text-sm font-bold text-base-content/60 uppercase tracking-widest">
              <li><a href="#" className="hover:text-primary dark:hover:text-[#ff6b6b] transition-colors">Medias</a></li>
              <li><a href="#" className="hover:text-primary dark:hover:text-[#ff6b6b] transition-colors">Skates</a></li>
              <li><a href="#" className="hover:text-primary dark:hover:text-[#ff6b6b] transition-colors">Gorras</a></li>
              <li><a href="#" className="hover:text-primary dark:hover:text-[#ff6b6b] transition-colors">Accesorios</a></li>
              <li><a href="#" className="hover:text-primary dark:hover:text-[#ff6b6b] transition-colors">Lijas</a></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-base-200 p-10 md:p-16 flex flex-col items-center justify-center text-center space-y-6 -mx-2 sm:-mx-4 md:-mx-6 mb-[-2.5rem]">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-primary dark:text-[#ff6b6b]">
          Mantenete al día
        </h2>
        <p className="text-lg text-base-content/70 max-w-2xl">
          Recibe las últimas novedades, colecciones exclusivas y notificaciones sobre nuevos lanzamientos de Crumbskate.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xl mt-6">
          <input
            type="email"
            placeholder="Introduce tu email..."
            className="input input-bordered input-lg flex-1 bg-base-100 text-base-content placeholder-neutral-content border-neutral focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
          <button className="btn btn-lg bg-primary hover:bg-neutral text-primary-content font-black uppercase tracking-wider border-0 shadow-lg rounded-sm">
            Suscribirse
          </button>
        </div>
      </section>

      {/* Footer Info */}
      <section className="text-center space-y-2 py-8 mt-12 bg-primary text-primary-content -mx-2 sm:-mx-4 md:-mx-6 relative z-10 mb-[-2.5rem]">
        <p className="text-xl font-black tracking-widest uppercase">Crumbskate</p>
        <p className="text-sm font-bold opacity-80">Cultura Skater Argentina &copy; 2026</p>
      </section>
    </div>
  );
};

export default Home;
