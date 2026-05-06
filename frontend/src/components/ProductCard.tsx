import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Product } from "../types";

const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

interface ProductCardProps {
  product: Product & { oldPrice?: number; sizes?: string[]; inStock?: boolean; stockInfo?: string; brand?: string };
  onAddToCart: (product: any) => void;
  isAdded: boolean;
}

const ProductCard = ({ product, onAddToCart, isAdded }: ProductCardProps) => {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const hasMultipleSizes = product.sizes && product.sizes.length > 1 && product.sizes[0] !== "Único";

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
    onAddToCart({ ...product, size: selectedSize || (product.sizes && product.sizes[0]) });
  };

  return (
    <div
      className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group cursor-pointer h-full flex flex-col"
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
      <figure className="h-56 overflow-hidden bg-neutral relative flex items-center justify-center flex-shrink-0">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-neutral/80 group-hover:bg-neutral transition-colors duration-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-14 h-14 text-neutral-content/25 group-hover:text-neutral-content/40 transition-colors duration-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" />
            </svg>
            <span className="text-neutral-content/30 text-xs font-bold uppercase tracking-widest">
              Imagen proximamente
            </span>
          </div>
        )}
        {!product.inStock && (
          <div className="absolute top-3 right-3 badge badge-error font-bold text-white border-0 shadow-lg tracking-wide uppercase text-[10px]">
            Sin Stock
          </div>
        )}
        {product.inStock && product.stockInfo && (
          <div className="absolute top-3 right-3 badge badge-warning font-bold text-black border-0 shadow-lg tracking-wide uppercase text-[10px]">
            {product.stockInfo}
          </div>
        )}
      </figure>

      <div className="card-body p-6 flex flex-col flex-grow">
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
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-black text-base-content/40 uppercase tracking-[0.2em]">
                {hasMultipleSizes ? "Seleccionar Talle" : "Talle Unico"}
              </span>
              {hasMultipleSizes && selectedSize && (
                <span className="text-[10px] font-black text-primary uppercase tracking-wider">
                  Seleccionado: {selectedSize}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => {
                const isSelected = selectedSize === size || (!hasMultipleSizes && size === product.sizes?.[0]);
                return (
                  <button
                    key={size}
                    onClick={(e) => hasMultipleSizes && handleSizeClick(e, size)}
                    className={`h-9 min-w-[36px] px-2 text-xs font-black transition-all duration-300 border-2 rounded-none flex items-center justify-center ${
                      isSelected
                        ? "bg-primary border-primary text-primary-content shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] scale-105 z-10"
                        : hasMultipleSizes
                        ? "bg-transparent border-neutral/20 text-base-content/60 hover:border-primary/50 hover:text-primary"
                        : "bg-neutral/10 border-transparent text-base-content/40 cursor-default"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-auto pt-6 flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-base-content/40 uppercase tracking-widest mb-1">
                Precio
              </span>
              <span className="text-3xl font-black text-base-content leading-none">
                {formatPrice(product.price)}
              </span>
            </div>
            <Link
              to={`/producto/${product.id}`}
              onClick={(e) => e.stopPropagation()}
              className="text-[11px] font-black uppercase tracking-tighter text-base-content/40 hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-0.5"
            >
              Ver detalle
            </Link>
          </div>

          {!product.inStock ? (
            <button className="btn btn-disabled no-animation bg-base-300 border-0 text-base-content/30 font-black uppercase tracking-widest rounded-none h-12">
              Sin stock
            </button>
          ) : (
            <button
              onClick={handleAddClick}
              disabled={isAdded || (hasMultipleSizes && !selectedSize)}
              className={`group/btn relative overflow-hidden h-12 transition-all duration-500 font-black uppercase tracking-widest text-xs border-0 rounded-none ${
                isAdded
                  ? "bg-success text-success-content cursor-default"
                  : hasMultipleSizes && !selectedSize
                  ? "bg-neutral/10 text-base-content/20 cursor-not-allowed"
                  : "bg-primary hover:bg-neutral text-primary-content hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] active:translate-x-1 active:translate-y-1 active:shadow-none"
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isAdded ? (
                  <>Agregado</>
                ) : hasMultipleSizes && !selectedSize ? (
                  <>Elegi tu talle</>
                ) : (
                  <>Agregar al carrito</>
                )}
              </span>
              {!isAdded && !(hasMultipleSizes && !selectedSize) && (
                <div className="absolute inset-0 bg-neutral translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
