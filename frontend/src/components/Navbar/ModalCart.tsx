import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";

const Cart = () => {
  const { cartItems } = useCart();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const toggle = () => setOpen((prev) => !prev);

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!ref.current?.contains(e.relatedTarget as Node)) {
      setOpen(false);
    }
  };

  return (
    <>
      <div className="flex-no">
        <div className="dropdown dropdown-end" ref={ref} onBlur={handleBlur}>
          <div
            role="button"
            tabIndex={0}
            className="btn btn-ghost btn-circle text-base-content hover:bg-primary/10 relative"
            onClick={toggle}
            onKeyDown={(e) => e.key === "Enter" && toggle()}
          >
            <div className="indicator">
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
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-error text-error-content text-[10px] font-impact w-5 h-5 flex items-center justify-center border-2 border-black">
                  {itemCount}
                </span>
              )}
            </div>
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                tabIndex={0}
                className="dropdown-content z-50 bg-concrete mt-3 w-80 border-4 border-black shadow-brutal overflow-hidden"
              >
                {cartItems.length > 0 ? (
                  <div className="flex flex-col">
                    <div className="p-4 border-b-2 border-primary/30 bg-base-300">
                      <span className="text-[10px] font-impact uppercase tracking-[0.3em] text-base-content">
                        Tu pedido ({itemCount})
                      </span>
                    </div>

                    <div className="max-h-60 overflow-y-auto divide-y divide-base-300">
                      {cartItems.map((item) => (
                        <div
                          key={`${item.id}-${item.selectedSize}`}
                          className="p-3 flex items-center gap-3 hover:bg-primary/5 transition-colors"
                        >
                          <div className="w-10 h-10 bg-base-300 border-2 border-base-300 flex items-center justify-center shrink-0">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5 text-base-content/20"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-impact uppercase truncate leading-none mb-1 tracking-wider">
                              {item.name}
                            </p>
                            <p className="text-[10px] font-mono font-bold text-base-content/50 uppercase">
                              {item.quantity} x{" "}
                              {new Intl.NumberFormat("es-AR", {
                                style: "currency",
                                currency: "ARS",
                                maximumFractionDigits: 0,
                              }).format(item.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-base-300 border-t-2 border-primary/30">
                      <Link
                        to="/carrito"
                        onClick={() => setOpen(false)}
                        className="block w-full bg-primary text-primary-content font-impact text-center py-3 uppercase tracking-[0.2em] text-xs border-2 border-black shadow-brutal-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                      >
                        Ver mi carrito
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 flex flex-col items-center text-center gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-base-content/20"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <p className="font-impact text-base-content/50 text-xs uppercase tracking-[0.3em] leading-tight">
                      Tu carrito esta vacio
                    </p>
                    <Link
                      to="/carrito"
                      onClick={() => setOpen(false)}
                      className="block w-full bg-primary text-primary-content font-impact text-center py-3 uppercase tracking-[0.2em] text-xs border-2 border-black shadow-brutal-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all mt-2"
                    >
                      Ir al carrito
                    </Link>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};
export default Cart;
