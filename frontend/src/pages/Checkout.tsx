import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Checkout = () => {
  const { cartItems, refreshCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (cartItems.length === 0 && !success) {
      navigate("/carrito");
    }
  }, [user, cartItems, navigate, success]);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 5000 ? 0 : 450;
  const total = subtotal + (cartItems.length > 0 ? shipping : 0);

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(n);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Confirmar pedido (lee del carrito activo en DB)
      await api.post("/pedidos");
      await refreshCart(); // Para vaciar el carrito localmente
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al procesar el pedido.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto py-10 sm:py-20 px-3 sm:px-4 text-center space-y-4 sm:space-y-6"
      >
        <div className="w-24 h-24 bg-primary/20 text-base-content border-4 border-primary flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-4xl font-impact uppercase tracking-[0.1em] sm:tracking-[0.2em] text-base-content">
          ¡Pedido Confirmado!
        </h1>
        <p className="text-base-content/50 font-mono text-sm">
          Tu pedido ha sido procesado exitosamente y esta pendiente de pago.
        </p>
        <div className="pt-4 sm:pt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link
            to="/perfil"
            className="bg-primary text-primary-content font-impact uppercase tracking-[0.2em] px-6 py-3 border-2 border-black shadow-brutal-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all text-sm"
          >
            Ver mis pedidos
          </Link>
          <Link
            to="/"
            className="bg-base-300 text-base-content font-impact uppercase tracking-[0.2em] px-6 py-3 border-2 border-primary/30 hover:border-primary transition-all text-sm"
          >
            Volver al inicio
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto py-6 sm:py-12 px-2 sm:px-4"
    >
      <h1 className="text-2xl sm:text-3xl font-impact uppercase tracking-[0.1em] sm:tracking-[0.2em] mb-4 sm:mb-8 text-base-content">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-base-200 border-2 sm:border-4 border-black shadow-brutal p-4 sm:p-6 md:p-8">
            <h2 className="text-xl font-impact uppercase tracking-[0.2em] text-base-content mb-6 border-b-2 border-primary/20 pb-4">
              Detalles de Envio y Pago
            </h2>

            {error && (
              <div className="bg-error/10 border-2 border-error p-4 text-warning mb-6 font-impact text-sm uppercase tracking-wider">
                {error}
              </div>
            )}

            <form
              id="checkout-form"
              onSubmit={handleCheckout}
              className="space-y-4"
            >
              {/* Simulacion de form para UI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label text-[10px] font-impact uppercase tracking-[0.3em] text-base-content/50">
                    Nombre
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full bg-base-300 border-2 border-primary/30 focus:border-primary text-base-content px-4 py-3 rounded-none font-mono text-sm tracking-wider outline-none transition-all placeholder:text-base-content/20"
                    placeholder="Juan"
                    defaultValue={user?.nombre?.split(" ")[0]}
                  />
                </div>
                <div className="form-control">
                  <label className="label text-[10px] font-impact uppercase tracking-[0.3em] text-base-content/50">
                    Apellido
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full bg-base-300 border-2 border-primary/30 focus:border-primary text-base-content px-4 py-3 rounded-none font-mono text-sm tracking-wider outline-none transition-all placeholder:text-base-content/20"
                    placeholder="Perez"
                    defaultValue={user?.nombre?.split(" ")[1] || ""}
                  />
                </div>
              </div>
              <div className="form-control">
                <label className="label text-[10px] font-impact uppercase tracking-[0.3em] text-base-content/50">
                  Direccion de Envio
                </label>
                <input
                  required
                  type="text"
                  className="w-full bg-base-300 border-2 border-primary/30 focus:border-primary text-base-content px-4 py-3 rounded-none font-mono text-sm tracking-wider outline-none transition-all placeholder:text-base-content/20"
                  placeholder="Av. Siempre Viva 123"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label text-[10px] font-impact uppercase tracking-[0.3em] text-base-content/50">
                    Ciudad
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full bg-base-300 border-2 border-primary/30 focus:border-primary text-base-content px-4 py-3 rounded-none font-mono text-sm tracking-wider outline-none transition-all placeholder:text-base-content/20"
                    placeholder="CABA"
                  />
                </div>
                <div className="form-control">
                  <label className="label text-[10px] font-impact uppercase tracking-[0.3em] text-base-content/50">
                    Codigo Postal
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full bg-base-300 border-2 border-primary/30 focus:border-primary text-base-content px-4 py-3 rounded-none font-mono text-sm tracking-wider outline-none transition-all placeholder:text-base-content/20"
                    placeholder="1000"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-base-200 border-4 border-black shadow-brutal overflow-hidden sticky top-24">
            <div className="p-6 border-b-2 border-primary/20 bg-base-300">
              <h2 className="text-xl font-impact uppercase tracking-[0.2em] text-base-content">
                Resumen
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-3 max-h-48 overflow-y-auto mb-4 border-b-2 border-base-300 pb-4">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.selectedSize}`}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="truncate pr-4 flex-1 font-mono text-xs">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-impact tracking-wider">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-sm">
                <span className="font-mono font-bold text-base-content/50">
                  Subtotal
                </span>
                <span className="font-impact tracking-wider">
                  {formatPrice(subtotal)}
                </span>
              </div>

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

              <div className="border-t-2 border-base-300 my-2"></div>

              <div className="flex justify-between items-end pt-2">
                <span className="text-lg font-impact uppercase tracking-[0.3em] text-base-content">
                  Total
                </span>
                <span className="text-3xl font-impact text-base-content leading-none mb-1 tracking-wider">
                  {formatPrice(total)}
                </span>
              </div>

              <button
                form="checkout-form"
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-content font-impact uppercase tracking-[0.2em] py-5 text-lg border-2 border-black shadow-brutal hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Procesando..." : "CONFIRMAR PEDIDO"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;
