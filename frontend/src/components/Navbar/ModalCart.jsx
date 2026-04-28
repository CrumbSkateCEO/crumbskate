import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const Cart = () => {
  const { cartItems } = useCart();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const toggle = () => setOpen((prev) => !prev);

  const handleBlur = (e) => {
    if (!ref.current?.contains(e.relatedTarget)) {
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
            className="btn btn-ghost btn-circle"
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
                <span className="badge badge-sm badge-primary indicator-item font-bold border-0 shadow-sm scale-90">
                  {itemCount}
                </span>
              )}
            </div>
          </div>

          {open && (
            <div
              tabIndex={0}
              className="card card-compact dropdown-content z-50 bg-base-200 mt-3 w-72 shadow-xl border border-neutral/20 overflow-hidden"
            >
              {cartItems.length > 0 ? (
                <div className="flex flex-col">
                  <div className="p-4 border-b border-neutral/10 bg-base-300/30">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Tu pedido ({itemCount})</span>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto divide-y divide-neutral/10">
                    {cartItems.map((item) => (
                      <div key={`${item.id}-${item.size}`} className="p-3 flex items-center gap-3 hover:bg-base-300/10 transition-colors">
                        <div className="w-10 h-10 bg-neutral rounded flex items-center justify-center shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-neutral-content/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black uppercase truncate leading-none mb-1">{item.name}</p>
                          <p className="text-[10px] font-bold opacity-50 uppercase">{item.quantity} x {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(item.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-base-300/30">
                    <Link 
                      to="/carrito" 
                      onClick={() => setOpen(false)}
                      className="btn btn-primary btn-sm w-full font-black uppercase text-[10px] rounded-sm"
                    >
                      Ver mi carrito
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="card-body items-center text-center py-8 gap-3">
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
                  <p className="font-bold text-base-content/50 text-[10px] uppercase tracking-widest leading-tight">
                    Tu carrito esta vacio
                  </p>
                  <Link 
                    to="/carrito" 
                    onClick={() => setOpen(false)}
                    className="btn btn-primary btn-sm w-full mt-2 font-black uppercase text-[10px] rounded-sm"
                  >
                    Ir al carrito
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default Cart;
