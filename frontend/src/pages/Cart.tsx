import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cartItems, updateQuantity, removeItem } = useCart();
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [activeDiscount, setActiveDiscount] = useState(0); // 1 = 100% discount
  const [couponError, setCouponError] = useState("");

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(n);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const discountAmount = subtotal * activeDiscount;
  const subtotalWithDiscount = subtotal - discountAmount;
  const shipping =
    subtotalWithDiscount > 5000 || activeDiscount === 1 ? 0 : 450;
  const total = subtotalWithDiscount + (cartItems.length > 0 ? shipping : 0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "CHIMICHANGA") {
      setActiveDiscount(1);
      setCouponError("");
      setIsCouponModalOpen(false);
    } else {
      setCouponError("Cupon invalido");
    }
  };

  if (cartItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto py-20 px-4 text-center"
      >
        <div className="bg-base-200 p-12 border-4 border-black shadow-brutal flex flex-col items-center">
          <div className="bg-base-300 w-24 h-24 border-4 border-primary/30 flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-base-content/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-impact uppercase tracking-[0.2em] mb-2 text-base-content">
            Tu carrito esta vacio
          </h1>
          <p className="text-base-content/40 mb-8 max-w-sm font-mono text-sm">
            ¿Todavia no sabes que comprar? ¡Mira nuestros ultimos lanzamientos!
          </p>
          <Link
            to="/"
            className="bg-primary text-primary-content font-impact uppercase tracking-[0.2em] px-8 py-4 border-2 border-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            Ir a la tienda
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto py-4 sm:py-8 md:py-12 px-2 sm:px-4 relative"
    >
      <h1 className="text-2xl sm:text-3xl font-impact uppercase tracking-[0.1em] sm:tracking-[0.2em] mb-4 sm:mb-8 text-base-content">
        Carrito
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 items-start">
        {/* List of items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-base-200 border-2 sm:border-4 border-black shadow-brutal overflow-hidden">
            <div className="p-4 md:p-6 bg-base-300 border-b-2 border-primary/20 flex justify-between items-center">
              <span className="font-impact uppercase tracking-[0.3em] text-xs text-base-content/60">
                Productos
              </span>
              <span className="font-impact uppercase tracking-[0.3em] text-xs text-base-content/60 hidden md:block">
                Subtotal
              </span>
            </div>

            <div className="divide-y divide-base-300">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}`}
                  className="p-4 md:p-6 flex flex-col md:flex-row gap-6 items-center md:items-start transition-colors hover:bg-primary/5"
                >
                  <div className="w-24 h-24 bg-base-300 border-2 border-base-300 overflow-hidden shrink-0 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-8 h-8 text-base-content/20"
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
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <Link
                      to={`/producto/${item.id}`}
                      className="text-lg font-impact hover:text-base-content transition-colors uppercase leading-tight tracking-wider"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-base-content/40 font-mono font-bold uppercase tracking-widest mt-1">
                      Crumbskate{" "}
                      {item.selectedSize ? `| Talle ${item.selectedSize}` : ""}
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs font-impact text-warning uppercase hover:underline tracking-wider"
                      >
                        Eliminar
                      </button>
                      <button className="text-xs font-impact text-base-content/50 uppercase hover:underline tracking-wider">
                        Guardar para despues
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto">
                    <div className="flex items-center border-2 border-black bg-base-300 overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-3 py-1 hover:bg-primary hover:text-primary-content transition-colors font-impact border-r-2 border-black"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 font-impact min-w-[40px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-3 py-1 hover:bg-primary hover:text-primary-content transition-colors font-impact border-l-2 border-black"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-xl font-impact tracking-wider ${activeDiscount === 1 ? "line-through opacity-30 text-xs" : "text-base-content"}`}
                      >
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      {activeDiscount === 1 && (
                        <p className="text-xl font-impact text-base-content tracking-wider">
                          Gratis
                        </p>
                      )}
                      {item.quantity > 1 && activeDiscount !== 1 && (
                        <p className="text-xs text-base-content/40 font-mono">
                          {formatPrice(item.price)} c/u
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-base-300 border-t-2 border-primary/20 flex justify-end">
              <Link
                to="/"
                className="text-xs font-impact uppercase text-base-content hover:text-warning tracking-wider"
              >
                Continuar comprando
              </Link>
            </div>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-4">
          <div className="bg-base-200 border-4 border-black shadow-brutal overflow-hidden sticky top-24">
            <div className="p-6 border-b-2 border-primary/20 bg-base-300">
              <h2 className="text-xl font-impact uppercase tracking-[0.2em] text-base-content">
                Resumen de compra
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="font-mono font-bold text-base-content/50">
                  Productos ({cartItems.reduce((a, b) => a + b.quantity, 0)})
                </span>
                <span className="font-impact tracking-wider">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {activeDiscount > 0 && (
                <div className="flex justify-between text-sm text-base-content font-impact">
                  <span className="uppercase tracking-[0.2em] text-[10px]">
                    Descuento Cupon
                  </span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="font-mono font-bold text-base-content/50">
                  Envio
                </span>
                <span
                  className={`font-impact tracking-wider ${shipping === 0 ? "text-base-content" : ""}`}
                >
                  {shipping === 0 ? "Gratis" : formatPrice(shipping)}
                </span>
              </div>

              {shipping > 0 && activeDiscount !== 1 && (
                <div className="bg-primary/10 p-3 border-2 border-primary/30">
                  <p className="text-[10px] font-impact uppercase text-base-content leading-tight tracking-wider">
                    Agrega {formatPrice(5000 - subtotalWithDiscount)} mas para
                    envio gratis
                  </p>
                </div>
              )}

              <div className="border-t-2 border-base-300 my-2"></div>

              <div className="flex justify-between items-end pt-2">
                <span className="text-lg font-impact uppercase tracking-[0.3em] text-base-content">
                  Total
                </span>
                <div className="text-right">
                  <p className="text-3xl font-impact text-base-content leading-none mb-1 tracking-wider">
                    {formatPrice(total)}
                  </p>
                  <p className="text-[10px] text-base-content/40 font-mono font-bold uppercase tracking-widest">
                    IVA incluido
                  </p>
                </div>
              </div>

              <Link
                to="/checkout"
                className="block w-full bg-primary text-primary-content font-impact text-center py-4 uppercase tracking-[0.2em] text-sm border-2 border-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all mt-4"
              >
                Continuar compra
              </Link>
            </div>
          </div>

          {/* Coupon / Benefits */}
          <div
            onClick={() => setIsCouponModalOpen(true)}
            className={`bg-base-200 border-4 border-black p-4 flex items-center gap-4 group cursor-pointer transition-all hover:shadow-brutal-sm ${activeDiscount === 1 ? "border-primary bg-primary/5" : ""}`}
          >
            <div
              className={`w-10 h-10 border-2 border-black flex items-center justify-center group-hover:scale-110 transition-transform ${activeDiscount === 1 ? "bg-primary text-primary-content" : "bg-base-300 text-base-content"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 11-1-1v1h1z"
                  clipRule="evenodd"
                />
                <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-impact uppercase tracking-[0.2em] text-base-content">
                {activeDiscount === 1
                  ? "Cupon aplicado: CHIMICHANGA"
                  : "¿Tenes un cupon?"}
              </p>
              <p className="text-[10px] font-mono font-bold text-base-content/40 uppercase">
                {activeDiscount === 1
                  ? "¡Disfruta tu regalo!"
                  : "Ingresalo haciendo click aqui"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Coupon Modal */}
      <AnimatePresence>
        {isCouponModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="bg-base-200 w-full max-w-sm border-4 border-black shadow-brutal overflow-hidden"
            >
              <div className="bg-primary p-6 flex justify-between items-center border-b-4 border-black">
                <h3 className="text-xl font-impact text-primary-content uppercase tracking-[0.2em]">
                  Ingresar Cupon
                </h3>
                <button
                  onClick={() => setIsCouponModalOpen(false)}
                  className="w-8 h-8 bg-black text-base-content flex items-center justify-center border-2 border-black hover:bg-error hover:text-white transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleApplyCoupon} className="p-8 space-y-6">
                <div className="form-control">
                  <label className="label py-0 mb-2">
                    <span className="text-[10px] font-impact uppercase tracking-[0.3em] text-base-content/50">
                      Codigo del cupon
                    </span>
                  </label>
                  <input
                    type="text"
                    autoFocus
                    placeholder="Ej: CHIMICHANGA"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className={`w-full bg-base-300 border-2 px-4 py-3 font-impact uppercase placeholder:opacity-30 text-base-content rounded-none tracking-wider outline-none ${couponError ? "border-error text-warning" : "border-primary/30 focus:border-primary"}`}
                  />
                  {couponError && (
                    <p className="text-[10px] font-impact text-warning uppercase mt-2 tracking-wider">
                      {couponError}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCouponModalOpen(false)}
                    className="flex-1 bg-base-300 text-base-content font-impact uppercase text-xs tracking-wider py-3 border-2 border-black hover:bg-base-300 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-primary-content font-impact uppercase text-xs tracking-wider py-3 border-2 border-black shadow-brutal-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                  >
                    Aplicar
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Cart;
