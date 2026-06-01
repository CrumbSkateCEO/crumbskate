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
      className="max-w-6xl mx-auto py-12 px-4 space-y-8"
    >
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Info */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-base-200 border-2 border-black/10 rounded-3xl shadow-xl p-8 relative overflow-hidden group hover:border-primary/50 transition-colors">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/20 transition-all duration-500"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-28 h-28 bg-gradient-to-tr from-primary to-accent text-primary-content rounded-full shadow-lg shadow-primary/30 flex items-center justify-center text-4xl font-black italic tracking-tighter mb-6 group-hover:scale-105 transition-transform duration-300">
                {user.nombre ? user.nombre.charAt(0).toUpperCase() : "U"}
              </div>
              <h2 className="text-3xl font-black uppercase text-center mb-1 tracking-tight text-base-content leading-none">
                {user.nombre}
              </h2>
              <p className="text-center text-base-content/50 font-bold mb-8 text-sm tracking-wider uppercase">
                {user.email}
              </p>

              <button
                onClick={logout}
                className="w-full btn btn-error btn-outline font-black uppercase tracking-widest rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <MdLogout size={20} />
                Cerrar Sesión
              </button>
            </div>
          </div>

          <div className="bg-base-200 border-2 border-black/10 rounded-3xl shadow-xl p-6 hidden lg:block">
            <h3 className="font-black uppercase tracking-widest text-sm mb-4 opacity-50">Resumen de cuenta</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <MdShoppingBag size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-50">Pedidos Totales</p>
                  <p className="text-xl font-black leading-none">{orders.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-info/10 text-info flex items-center justify-center">
                  <MdLocalShipping size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-50">En tránsito</p>
                  <p className="text-xl font-black leading-none">
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
            <MdHistory size={32} className="text-primary" />
            <h3 className="text-4xl font-black uppercase tracking-tighter italic text-base-content">
              Historial de Pedidos
            </h3>
          </div>

          {loading ? (
            <div className="flex justify-center p-12">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={order.id}
                  className="bg-base-200 rounded-3xl border-2 border-transparent hover:border-primary/20 shadow-lg hover:shadow-primary/5 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all duration-300 group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-black text-xl tracking-tight">
                        Pedido #{order.id}
                      </p>
                      <span
                        className={`badge font-black uppercase text-[9px] tracking-widest border-0 ${
                          order.estado === "pendiente" ? "bg-warning/20 text-warning" : 
                          order.estado === "entregado" ? "bg-success/20 text-success" : 
                          order.estado === "cancelado" ? "bg-error/20 text-error" : 
                          "bg-primary/20 text-primary"
                        }`}
                      >
                        {order.estado}
                      </span>
                    </div>
                    <p className="text-sm font-bold uppercase opacity-50 tracking-widest">
                      {new Date(order.created_at).toLocaleDateString("es-AR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })} • {order.cantidad_items} articulo(s)
                    </p>
                  </div>
                  
                  <div className="flex flex-col md:items-end w-full md:w-auto">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-1">Total abonado</p>
                    <p className="text-3xl font-black text-base-content leading-none mb-3">
                      {formatPrice(order.total)}
                    </p>
                    <Link to={`/pedido/${order.id}`} className="btn btn-sm btn-ghost bg-base-300 text-xs font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity w-full md:w-auto">
                      Ver Detalles
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-base-200 rounded-3xl border-2 border-dashed border-base-content/20 p-16 text-center">
              <div className="w-24 h-24 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <MdShoppingBag className="w-12 h-12 text-base-content/20" />
              </div>
              <h4 className="text-2xl font-black uppercase tracking-tight mb-2">Aún no hay pedidos</h4>
              <p className="text-sm font-bold uppercase tracking-widest opacity-50">Tus compras recientes aparecerán aquí.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
