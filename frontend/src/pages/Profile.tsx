import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import api from "../services/api";
import { Link, Navigate } from "react-router-dom";
import { MdLogout, MdLocalShipping, MdHistory, MdShoppingBag } from "react-icons/md";

const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

const sectionReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

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
      variants={sectionReveal}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto py-12 px-4 space-y-8"
    >
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Info */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-primary text-primary-content border-4 border-black shadow-brutal p-8 relative group transition-transform hover:-translate-y-1 hover:-translate-x-1">
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-28 h-28 bg-black text-white border-4 border-black flex items-center justify-center text-6xl font-impact uppercase mb-6 shadow-brutal-sm group-hover:scale-105 transition-transform duration-300">
                {user.nombre ? user.nombre.charAt(0) : "U"}
              </div>
              <h2 className="text-3xl font-impact uppercase text-center mb-2 tracking-[0.1em] leading-none">
                {user.nombre}
              </h2>
              <p className="text-center font-mono font-bold mb-8 text-xs tracking-wider uppercase opacity-80">
                {user.email}
              </p>

              <button
                onClick={logout}
                className="w-full bg-base-200 text-base-content border-4 border-black shadow-brutal font-impact uppercase tracking-[0.2em] py-3 hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 touch-manipulation"
              >
                <MdLogout size={20} />
                Cerrar Sesión
              </button>
            </div>
          </div>

          <div className="bg-base-200 border-4 border-black shadow-brutal p-6 hidden lg:block">
            <h3 className="font-impact uppercase tracking-[0.2em] text-lg mb-6 border-b-4 border-primary pb-2 inline-block">Resumen</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 border-4 border-black bg-primary text-primary-content flex items-center justify-center shadow-brutal-sm">
                  <MdShoppingBag size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] opacity-60">Pedidos Totales</p>
                  <p className="text-3xl font-impact leading-none mt-1">{orders.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 border-4 border-black bg-base-300 text-base-content flex items-center justify-center shadow-brutal-sm">
                  <MdLocalShipping size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] opacity-60">En tránsito</p>
                  <p className="text-3xl font-impact leading-none mt-1">
                    {orders.filter(o => o.estado === 'enviado' || o.estado === 'en proceso').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Historial de Pedidos */}
        <div className="w-full lg:w-2/3">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center border-2 border-black">
              <MdHistory size={28} />
            </div>
            <h3 className="text-3xl sm:text-4xl font-impact uppercase tracking-[0.1em] text-base-content">
              Historial de Pedidos
            </h3>
          </div>

          {loading ? (
            <div className="flex justify-center p-12 border-4 border-black shadow-brutal bg-base-200">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={order.id}
                  className="bg-base-200 border-4 border-black shadow-brutal p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:-translate-y-1 hover:-translate-x-1 transition-transform"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <p className="font-impact text-2xl tracking-wider">
                        PEDIDO #{order.id}
                      </p>
                      <span
                        className={`font-mono font-bold uppercase text-[10px] tracking-widest px-2 py-1 border-2 border-black shadow-brutal-sm ${
                          order.estado === "pendiente" ? "bg-warning text-warning-content" : 
                          order.estado === "entregado" ? "bg-success text-success-content" : 
                          order.estado === "cancelado" ? "bg-error text-error-content" : 
                          "bg-primary text-primary-content"
                        }`}
                      >
                        {order.estado}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono font-bold uppercase opacity-70 tracking-widest">
                      {new Date(order.created_at).toLocaleDateString("es-AR", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })} • {order.cantidad_items} ARTICULO(S)
                    </p>
                  </div>
                  
                  <div className="flex flex-col md:items-end w-full md:w-auto">
                    <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] opacity-60 mb-1">Total</p>
                    <p className="text-4xl font-impact text-base-content leading-none mb-4">
                      {formatPrice(order.total)}
                    </p>
                    <Link 
                      to={`/pedido/${order.id}`} 
                      className="bg-black text-white font-impact uppercase tracking-[0.2em] px-6 py-2 border-2 border-black hover:bg-white hover:text-black transition-colors text-center text-xs w-full md:w-auto touch-manipulation"
                    >
                      Ver Detalles
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-base-200 border-4 border-black shadow-brutal p-16 text-center">
              <div className="w-24 h-24 bg-primary border-4 border-black shadow-brutal-sm flex items-center justify-center mx-auto mb-6 text-primary-content">
                <MdShoppingBag className="w-12 h-12" />
              </div>
              <h4 className="text-3xl font-impact uppercase tracking-[0.1em] mb-3">Aún no hay pedidos</h4>
              <p className="text-xs font-mono font-bold uppercase tracking-widest opacity-70">Tus compras recientes aparecerán aquí.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
