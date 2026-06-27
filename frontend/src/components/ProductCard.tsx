import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Product } from "../types";
import { getAssetUrl } from "../utils/assets";

const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

interface ProductCardProps {
  product: Product & {
    oldPrice?: number;
    sizes?: string[];
    variants?: any[];
    inStock?: boolean;
    stockInfo?: string;
    brand?: string;
  };
  onAddToCart: (product: any) => void;
  isAdded: boolean;
}

const ProductCard = ({ product, onAddToCart, isAdded }: ProductCardProps) => {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const hasMultipleSizes =
    product.sizes && (product.sizes.length > 1 || product.sizes[0] !== "Único");

  const isNew = () => {
    if (!product.createdAt) return false;
    const createdDate = new Date(product.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 14;
  };

  const handleSizeClick = (e: React.MouseEvent, size: string) => {
    e.stopPropagation();
    setSelectedSize(size === selectedSize ? null : size);
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasMultipleSizes && !selectedSize) {
      // Opcional: mostrar un tooltip o alerta de que debe seleccionar un talle
      return;
    }
    onAddToCart({
      ...product,
      size: selectedSize || (product.sizes && product.sizes[0]),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="bg-base-200 border-2 sm:border-4 border-black shadow-brutal hover:shadow-brutal-neon transition-all duration-300 overflow-hidden group cursor-pointer h-full flex flex-col relative"
      onClick={() => navigate(`/producto/${product.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/producto/${product.id}`);
        }
      }}
      role="button"
      tabIndex={0}
    >
      {/* STICKER */}
      {product.inStock !== false && (product.stockInfo || isNew()) && (
        <div className="sticker bg-primary text-primary-content">
          {product.stockInfo || "NEW"}
        </div>
      )}
      {product.inStock === false && (
        <div className="sticker bg-error text-error-content">AGOTADO</div>
      )}

      <figure className="h-44 sm:h-56 overflow-hidden bg-base-300 relative flex items-center justify-center flex-shrink-0">
        {product.image ? (
          <img
            src={getAssetUrl(product.image)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-base-300 group-hover:bg-base-200 transition-colors duration-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-14 h-14 text-base-content/20 group-hover:text-base-content/40 transition-colors duration-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1"
            >
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="0"
                strokeWidth="1.5"
              />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 15l-5-5L5 21"
              />
            </svg>
            <span className="text-base-content/30 text-xs font-impact uppercase tracking-[0.3em]">
              Imagen proximamente
            </span>
          </div>
        )}
        {/* Scanline overlay on image */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
          }}
        />
      </figure>

      <div className="p-3 sm:p-5 flex flex-col flex-grow border-t-2 sm:border-t-4 border-black">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-impact text-base sm:text-xl text-base-content leading-tight tracking-wider uppercase">
            {product.name}
          </h3>
        </div>

        <p className="text-base-content/60 text-[10px] uppercase font-mono font-bold tracking-[0.3em] mt-1">
          {product.category}
        </p>

        {product.sizes && (
          <div className="mt-4 pt-4 border-t-2 border-base-300">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-mono font-bold text-base-content/40 uppercase tracking-[0.2em]">
                {hasMultipleSizes ? "Seleccionar Talle" : "Talle Unico"}
              </span>
              {hasMultipleSizes && selectedSize && (
                <span className="text-[10px] font-impact text-base-content uppercase tracking-wider">
                  {selectedSize}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => {
                const variantInfo = product.variants?.find((v: any) => v.talla === size);
                const isOutOfStock = variantInfo ? variantInfo.stock <= 0 : !product.inStock;
                const isSelected =
                  selectedSize === size ||
                  (!hasMultipleSizes && size === product.sizes?.[0]);
                return (
                  <button
                    key={size}
                    disabled={isOutOfStock}
                    onClick={(e) =>
                      hasMultipleSizes && handleSizeClick(e, size)
                    }
                    className={`min-h-10 h-10 min-w-[40px] px-2 text-xs font-impact tracking-wider transition-all duration-300 border-2 rounded-none flex items-center justify-center touch-manipulation ${
                      isSelected
                        ? "bg-primary border-black text-primary-content shadow-brutal-sm scale-105 z-10"
                        : hasMultipleSizes
                          ? "bg-transparent border-base-300 text-base-content/60 hover:border-primary/50 hover:text-primary"
                          : "bg-base-300/30 border-transparent text-base-content/40 cursor-default"
                    } disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-base-300 disabled:hover:text-base-content/60 relative overflow-hidden`}
                  >
                    {size}
                    {isOutOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-[2px] bg-error rotate-45 transform origin-center absolute"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-auto pt-6 flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono font-bold text-base-content/40 uppercase tracking-widest mb-1">
                Precio
              </span>
              <span className="text-2xl sm:text-3xl font-impact text-base-content leading-none tracking-wider">
                {formatPrice(product.price)}
              </span>
            </div>
            <Link
              to={`/producto/${product.id}`}
              onClick={(e) => e.stopPropagation()}
              className="text-[11px] font-mono font-bold uppercase tracking-tighter text-base-content/70 hover:text-base-content transition-colors border-b-2 border-transparent hover:border-primary pb-0.5"
            >
              Ver detalle
            </Link>
          </div>

          {!product.inStock ? (
            <button className="bg-base-300 border-2 border-black text-base-content/30 font-impact uppercase tracking-widest rounded-none h-14 cursor-not-allowed">
              Sin stock
            </button>
          ) : (
            <button
              onClick={handleAddClick}
              disabled={isAdded || (hasMultipleSizes && !selectedSize)}
              className={`group/btn relative overflow-hidden min-h-14 h-14 transition-all duration-300 font-impact uppercase tracking-[0.2em] text-sm border-2 border-black rounded-none touch-manipulation ${
                isAdded
                  ? "bg-primary text-primary-content cursor-default shadow-brutal-sm"
                  : hasMultipleSizes && !selectedSize
                    ? "bg-base-300/30 text-base-content/20 cursor-not-allowed"
                    : "bg-primary text-primary-content shadow-brutal md:hover:shadow-none md:hover:translate-x-[4px] md:hover:translate-y-[4px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isAdded ? (
                  <>&#10003; Agregado</>
                ) : hasMultipleSizes && !selectedSize ? (
                  <>Elegi tu talle</>
                ) : (
                  <>Agregar al carrito</>
                )}
              </span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
