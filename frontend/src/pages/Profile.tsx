import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Navigate } from "react-router-dom";

const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

const Profile = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.get("/pedidos")
        .then(res => {
          setOrders(res.data);
        })
        .catch(err => console.error("Error cargando pedidos:", err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-12">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Sidebar Info */}
        <div className="w-full md:w-1/3 bg-base-200 rounded-3xl p-8 shadow-lg border border-neutral/20">
          <div className="w-24 h-24 bg-primary text-primary-content rounded-full flex items-center justify-center text-3xl font-black mb-6 shadow-inner mx-auto">
            {user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U'}
          </div>
          <h2 className="text-2xl font-black uppercase text-center mb-1">{user.nombre}</h2>
          <p className="text-center text-base-content/60 font-bold mb-8 text-sm">{user.email}</p>
          
          <button 
            onClick={logout}
            className="btn btn-outline btn-error w-full font-black uppercase tracking-widest text-xs"
          >
            Cerrar Sesion
          </button>
        </div>

        {/* Historial de Pedidos */}
        <div className="w-full md:w-2/3 space-y-6">
           <h3 className="text-2xl font-black uppercase tracking-tighter italic border-b border-neutral/20 pb-4">
             Mis Pedidos
           </h3>

           {loading ? (
             <div className="flex justify-center p-12">
               <span className="loading loading-spinner loading-lg text-primary"></span>
             </div>
           ) : orders.length > 0 ? (
             <div className="space-y-4">
               {orders.map(order => (
                 <div key={order.id} className="bg-base-200 rounded-2xl p-6 shadow-md border border-neutral/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                   <div>
                     <p className="font-black text-lg mb-1">Pedido #{order.id}</p>
                     <p className="text-xs text-base-content/60 font-bold uppercase tracking-widest mb-3">
                       {new Date(order.created_at).toLocaleDateString('es-AR', {
                         year: 'numeric',
                         month: 'long',
                         day: 'numeric'
                       })}
                     </p>
                     <span className={`badge border-0 font-black uppercase text-[10px] tracking-widest ${order.estado === 'pendiente' ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'}`}>
                       {order.estado}
                     </span>
                   </div>
                   <div className="text-left sm:text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                     <div>
                       <p className="text-[10px] font-black uppercase opacity-50 mb-1">{order.cantidad_items} articulo(s)</p>
                       <p className="text-2xl font-black text-primary leading-none">{formatPrice(order.total)}</p>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           ) : (
             <div className="bg-base-200 rounded-2xl p-12 text-center border border-neutral/20">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-base-content/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
               </svg>
               <p className="text-lg font-bold text-base-content/60">Aun no tenes pedidos realizados.</p>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
