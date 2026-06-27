import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import { getAssetUrl } from "../utils/assets";
import { useCart } from "../context/CartContext";

const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedSize, setSelectedSize] = useState<string>("Único");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/productos/${id}`);
        setProduct(data);
        
        // Si hay variantes, preseleccionar la primera
        if (data.variantes && data.variantes.length > 0) {
          setSelectedSize(data.variantes[0].talla);
        } else {
          setSelectedSize("Único");
        }
      } catch (err: any) {
        setError(err.response?.data?.error || "Error al cargar el producto");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <span className="loading loading-spinner text-primary loading-lg"></span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-impact text-error tracking-widest uppercase">{error || "Producto no encontrado"}</p>
        <Link to="/" className="btn btn-primary font-impact uppercase tracking-widest border-2 border-black rounded-none shadow-brutal hover:shadow-none hover:translate-y-1 transition-all">Volver al inicio</Link>
      </div>
    );
  }

  const variantIds = product.variantes?.map((v: any) => v.id) || [];
  const isAdded = cartItems.some((item) => variantIds.includes(item.variante_id) || item.variante_id === product.id);
  const inStock = product.activo === 1; // Asumimos stock si está activo por ahora
  
  // Extraemos las tallas de las variantes si existen
  const sizes = product.variantes && product.variantes.length > 0 
    ? [...new Set(product.variantes.map((v: any) => v.talla))] 
    : ["Único"];
    
  const hasMultipleSizes = sizes.length > 1 || sizes[0] !== "Único";

  let varianteSeleccionada = null;
  if (product.variantes && product.variantes.length > 0) {
    varianteSeleccionada = product.variantes.find((v: any) => v.talla === selectedSize);
  }
  const isSelectedOutOfStock = varianteSeleccionada ? varianteSeleccionada.stock <= 0 : !inStock;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      variante_id: varianteSeleccionada ? varianteSeleccionada.id : product.id,
      name: product.nombre,
      price: product.precio_base,
      image: product.imagen_url,
      size: selectedSize,
      category: product.categoria
    });
  };

  const handleBuyNow = async () => {
    let varianteSeleccionada = null;
    if (product.variantes && product.variantes.length > 0) {
      varianteSeleccionada = product.variantes.find((v: any) => v.talla === selectedSize);
    }

    await addToCart({
      id: product.id,
      variante_id: varianteSeleccionada ? varianteSeleccionada.id : product.id,
      name: product.nombre,
      price: product.precio_base,
      image: product.imagen_url,
      size: selectedSize,
      category: product.categoria
    });
    
    navigate("/checkout");
  };

  const imageUrl = product.imagen_url ? getAssetUrl(product.imagen_url) : null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-7xl mx-auto py-4 sm:py-8 md:py-12 space-y-6 sm:space-y-8"
    >
      <div className="text-xs font-mono text-base-content/50 uppercase tracking-[0.2em] flex items-center gap-2">
        <Link to="/" className="hover:text-base-content transition-colors">
          Inicio
        </Link>
        <span className="text-base-content/30">/</span>
        <span>Producto</span>
        <span className="text-base-content/30">/</span>
        <span className="text-base-content font-bold">{product.nombre}</span>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <article className="bg-base-200 border-2 sm:border-4 border-black shadow-brutal">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="min-h-[240px] sm:min-h-[380px] bg-base-300 border-b-2 sm:border-b-4 lg:border-b-0 lg:border-r-4 border-black flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.06]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(139,26,26,0.15) 3px, rgba(139,26,26,0.15) 6px)",
                }}
              />
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={product.nombre} 
                  className="w-full h-full object-cover max-w-md border-4 border-base-300 relative z-10"
                />
              ) : (
                <div className="w-full max-w-sm aspect-square bg-base-200 border-4 border-base-300 flex flex-col items-center justify-center text-base-content/30 gap-3 relative z-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-16 h-16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.2"
                      d="M20.38 3.46 16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10a2 2 0 002 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"
                    />
                  </svg>
                  <span className="text-xs uppercase tracking-[0.3em] font-impact">
                    Imagen del producto
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-primary font-impact">
                  {product.marca || "CRUMBSKATE"}
                </p>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-impact uppercase leading-tight tracking-wider text-base-content">
                  {product.nombre}
                </h1>
                <p className="text-xs text-base-content/50 mt-2 uppercase tracking-[0.2em] font-mono">
                  5 cuotas de {formatPrice(Math.round(product.precio_base / 5))}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-impact text-base-content tracking-wider">
                  {formatPrice(product.precio_base)}
                </p>
              </div>

              {hasMultipleSizes && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] font-impact text-base-content/50 mb-2">
                    Talle
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size: any) => {
                      const variantInfo = product.variantes?.find((v: any) => v.talla === size);
                      const isOutOfStock = variantInfo ? variantInfo.stock <= 0 : !inStock;
                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          disabled={isOutOfStock}
                          className={`min-w-12 px-3 py-2 font-impact tracking-wider text-sm border-2 border-black rounded-none transition-all ${
                            selectedSize === size
                              ? "bg-primary text-primary-content shadow-brutal-sm"
                              : "bg-base-300 text-base-content/60 hover:border-primary/50 hover:text-base-content"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {!inStock && (
                <div className="bg-error/10 border-2 border-error p-4 text-center">
                  <p className="text-primary font-impact uppercase tracking-[0.2em]">
                    Producto sin stock
                  </p>
                  <p className="text-primary/60 text-xs font-mono mt-1">
                    Próximamente disponible
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-primary text-primary-content font-impact uppercase tracking-[0.2em] py-4 border-2 border-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSelectedOutOfStock}
                >
                  {!isSelectedOutOfStock ? "Comprar ahora" : "Sin stock"}
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={isSelectedOutOfStock || isAdded}
                  className={`flex-1 font-impact uppercase tracking-[0.2em] py-4 border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    isAdded 
                      ? "bg-base-300 text-base-content border-black" 
                      : "bg-base-300 text-base-content border-primary/30 hover:border-primary hover:bg-primary/10"
                  }`}
                >
                  {isAdded ? "Agregado" : (!isSelectedOutOfStock ? "Agregar al carrito" : "Sin stock")}
                </button>
              </div>

              {hasMultipleSizes && selectedSize && (
                <p className="text-xs text-base-content/40 uppercase tracking-[0.2em] font-mono">
                  Seleccionado: talle {selectedSize}
                </p>
              )}
            </div>
          </div>
        </article>
      </div>

      <div className="bg-base-200 border-4 border-black shadow-brutal p-6 md:p-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <section className="space-y-4 border-b-4 xl:border-b-0 xl:border-r-4 border-black pb-6 xl:pb-0 xl:pr-8">
            <h2 className="text-xl md:text-2xl font-impact uppercase text-base-content tracking-[0.2em]">
              Descripción
            </h2>
            <p className="text-base-content/60 leading-relaxed font-mono text-sm whitespace-pre-line">
              {product.descripcion || "Sin descripción disponible."}
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl md:text-2xl font-impact uppercase text-base-content tracking-[0.2em]">
                Comentarios
              </h2>
            </div>

            <div className="bg-base-300 border-2 border-base-300 p-8 text-center flex flex-col items-center justify-center gap-4">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-base-content/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
               <div>
                  <p className="text-base-content/60 font-mono text-sm">Aún no hay comentarios para este producto.</p>
                  <p className="text-primary font-impact text-xs mt-2 tracking-widest uppercase">Solo los usuarios que hayan comprado este producto podrán dejar su reseña.</p>
               </div>
            </div>
            
            {/* Formulario deshabilitado por ahora hasta que el backend soporte reseñas de clientes */}
            <div className="opacity-50 pointer-events-none mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-[10px] font-impact uppercase tracking-[0.2em] text-base-content/50">
                    Tu puntuación:
                  </p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        disabled
                        className="text-lg leading-none text-base-content/25"
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Debe comprar el producto para opinar..."
                    disabled
                    className="w-full bg-base-300 border-2 border-primary/30 text-base-content px-4 py-2 rounded-none font-mono text-sm tracking-wider h-10"
                  />
                  <button
                    disabled
                    className="h-10 px-4 bg-base-300 text-base-content/50 font-impact text-xs uppercase tracking-wider border-2 border-black flex items-center gap-2"
                  >
                    Enviar
                  </button>
                </div>
            </div>
          </section>
        </div>
      </div>
    </motion.section>
  );
};

export default ProductDetail;

