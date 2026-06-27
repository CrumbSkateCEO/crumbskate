import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import api from "../services/api";
import { MdArrowBack, MdCancel, MdLocalShipping } from "react-icons/md";

const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user && id) {
      api.get(`/pedidos/${id}`)
        .then((res) => {
          setOrder(res.data);
        })
        .catch((err) => {
          console.error("Error cargando pedido:", err);
          setError("No se pudo cargar el pedido. Puede que no exista o no tengas permiso.");
        })
        .finally(() => setLoading(false));
    }
  }, [user, id]);

  const handleCancelOrder = async () => {
    if (!window.confirm("¿Estás seguro que querés cancelar este pedido?")) return;
    
    try {
      setCancelling(true);
      await api.put(`/pedidos/${id}/cancelar`);
      // Update local state to reflect cancellation
      setOrder({ ...order, estado: 'cancelado' });
      alert("Pedido cancelado exitosamente.");
    } catch (err: any) {
      console.error("Error al cancelar:", err);
      alert(err.response?.data?.error || "Error al cancelar el pedido.");
    } finally {
      setCancelling(false);
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="bg-error text-error-content border-4 border-black shadow-brutal p-8">
          <h2 className="text-3xl font-impact uppercase mb-4 tracking-[0.1em]">Error</h2>
          <p className="font-mono font-bold uppercase tracking-wider mb-6 opacity-80">{error}</p>
          <Link to="/perfil" className="bg-black text-white font-impact uppercase tracking-[0.2em] px-8 py-3 border-4 border-black shadow-brutal hover:bg-white hover:text-black hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all inline-block touch-manipulation">
            Volver al perfil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-12 px-4 space-y-8"
    >
      <div className="flex items-center justify-between mb-2">
        <Link to="/perfil" className="bg-base-200 text-base-content hover:bg-black hover:text-white font-impact uppercase tracking-[0.2em] flex items-center gap-2 border-4 border-black shadow-brutal hover:shadow-none hover:translate-y-1 hover:translate-x-1 px-4 py-2 transition-all touch-manipulation">
          <MdArrowBack size={20} />
          Volver
        </Link>
      </div>

      <div className="bg-base-200 border-4 border-black shadow-brutal overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.5) 10px, rgba(0,0,0,0.5) 12px)" }}></div>
        
        <div className="p-8 border-b-4 border-black flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10 bg-base-300/50">
          <div>
            <h1 className="text-4xl font-impact uppercase tracking-wider text-base-content mb-2">
              Pedido #{order.id}
            </h1>
            <p className="text-sm font-mono uppercase tracking-[0.2em] opacity-60">
              Realizado el {new Date(order.created_at).toLocaleDateString("es-AR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-3">
            <span
              className={`badge font-impact uppercase text-xs tracking-[0.2em] py-4 px-6 border-2 border-black rounded-none shadow-brutal-sm ${
                order.estado === "pendiente" ? "bg-info text-info-content" : 
                order.estado === "entregado" ? "bg-success text-success-content" : 
                order.estado === "cancelado" ? "bg-error text-error-content" : 
                "bg-primary text-primary-content"
              }`}
            >
              {order.estado}
            </span>
            {order.estado === "pendiente" && (
              <button 
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="btn btn-sm btn-error font-impact uppercase tracking-widest flex items-center gap-2 border-2 border-black rounded-none shadow-brutal-sm hover:translate-y-1 hover:shadow-none transition-all"
              >
                {cancelling ? <span className="loading loading-spinner loading-xs"></span> : <MdCancel size={16} />}
                Cancelar Pedido
              </button>
            )}
          </div>
        </div>

        <div className="p-8 relative z-10 bg-base-200">
          <h3 className="font-impact uppercase tracking-[0.2em] text-xl mb-6 text-base-content border-b-2 border-black pb-2 inline-block">Artículos del Pedido</h3>
          <div className="space-y-4">
            {order.items?.map((item: any, idx: number) => (
              <div key={idx} className="bg-base-300 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-2 border-black shadow-brutal-sm hover:translate-x-1 hover:-translate-y-1 hover:shadow-brutal transition-all">
                <div className="flex-1">
                  <p className="font-impact text-xl uppercase tracking-wider text-base-content">{item.nombre}</p>
                  <p className="text-xs font-mono uppercase tracking-[0.1em] opacity-70 mt-1">
                    Talle: <span className="font-bold">{item.talla}</span> | Color: <span className="font-bold">{item.color}</span> | Cantidad: <span className="font-bold">{item.cantidad}</span>
                  </p>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto bg-base-200 p-3 border-2 border-black">
                  <p className="font-impact text-2xl text-base-content tracking-wider">
                    {formatPrice(parseFloat(item.precio_unitario) * item.cantidad)}
                  </p>
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-60">
                    {formatPrice(parseFloat(item.precio_unitario))} c/u
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t-4 border-black flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="w-full md:w-auto">
              <h3 className="font-impact uppercase tracking-[0.2em] text-sm mb-4 opacity-70">Información del Envío</h3>
              <div className="bg-base-300 p-4 border-2 border-black shadow-brutal-sm flex items-center gap-3">
                <MdLocalShipping size={24} className="text-primary" />
                <div>
                  <p className="font-impact text-sm uppercase tracking-wider">Envío a Domicilio</p>
                  <p className="text-[10px] font-mono uppercase opacity-70 tracking-[0.2em] mt-1">A cargo de MercadoLibre</p>
                </div>
              </div>
            </div>

            <div className="text-right w-full md:w-auto bg-primary text-primary-content p-6 border-4 border-black shadow-brutal transform rotate-1 hover:rotate-0 transition-transform">
              <p className="text-xs font-impact uppercase tracking-[0.3em] opacity-80 mb-1">Total Abonado</p>
              <p className="text-4xl md:text-5xl font-impact tracking-wider leading-none">
                {formatPrice(order.total)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderDetail;
