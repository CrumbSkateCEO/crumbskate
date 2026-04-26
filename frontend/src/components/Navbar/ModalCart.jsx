import { useState, useRef } from "react";

const Cart = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

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
            </div>
          </div>

          {open && (
            <div
              tabIndex={0}
              className="card card-compact dropdown-content z-50 bg-base-200 mt-3 w-64 shadow border border-neutral/20"
            >
              <div className="card-body items-center text-center py-8 gap-3">
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
                    strokeWidth="1.5"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <p className="font-bold text-base-content/50 text-sm uppercase tracking-widest">
                  Tu carrito está vacío
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default Cart;
