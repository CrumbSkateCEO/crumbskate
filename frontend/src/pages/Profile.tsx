import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import api from "../services/api";
import { Navigate } from "react-router-dom";

const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

const Profile = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api
        .get("/pedidos")
        .then((res) => {
          setOrders(res.data);
        })
        .catch((err) => console.error("Error cargando pedidos:", err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto py-12 px-4 space-y-12"
    >
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar Info */}
        <div className="w-full md:w-1/3 bg-base-200 border-4 border-black shadow-brutal p-8">
          <div className="w-24 h-24 bg-primary text-primary-content border-4 border-black flex items-center justify-center text-3xl font-impact mb-6 mx-auto">
            {user.nombre ? user.nombre.charAt(0).toUpperCase() : "U"}
          </div>
          <h2 className="text-2xl font-impact uppercase text-center mb-1 tracking-[0.2em] text-base-content">
            {user.nombre}
          </h2>
          <p className="text-center text-base-content/40 font-mono font-bold mb-8 text-xs tracking-wider">
            {user.email}
          </p>

          <button
            onClick={logout}
            className="w-full bg-error text-white font-impact uppercase tracking-[0.2em] py-3 border-2 border-black shadow-brutal-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all text-xs"
          >
            Cerrar Sesion
          </button>
        </div>

        {/* Historial de Pedidos */}
        <div className="w-full md:w-2/3 space-y-6">
          <h3 className="text-2xl font-impact uppercase tracking-[0.2em] text-base-content border-b-2 border-primary/20 pb-4">
            Mis Pedidos
          </h3>

          {loading ? (
            <div className="flex justify-center p-12">
              <span className="loading loading-spinner loading-lg text-base-content"></span>
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-base-200 border-4 border-black shadow-brutal-sm p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-primary/50 transition-colors"
                >
                  <div>
                    <p className="font-impact text-lg mb-1 tracking-wider">
                      Pedido #{order.id}
                    </p>
                    <p className="text-xs text-base-content/40 font-mono font-bold uppercase tracking-widest mb-3">
                      {new Date(order.created_at).toLocaleDateString("es-AR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <span
                      className={`inline-block px-3 py-1 border-2 border-black font-impact uppercase text-[10px] tracking-[0.2em] ${order.estado === "pendiente" ? "bg-error/20 text-warning" : "bg-primary/20 text-base-content"}`}
                    >
                      {order.estado}
                    </span>
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                    <div>
                      <p className="text-[10px] font-impact uppercase text-base-content/40 mb-1 tracking-wider">
                        {order.cantidad_items} articulo(s)
                      </p>
                      <p className="text-2xl font-impact text-base-content leading-none tracking-wider">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-base-200 border-4 border-black p-12 text-center shadow-brutal">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-base-content/20 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="text-lg font-impact text-base-content/50 tracking-wider uppercase">
                Aun no tenes pedidos realizados.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
