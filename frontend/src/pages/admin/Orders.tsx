import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { MdSearch, MdFilterList, MdCheckCircle, MdPending, MdLocalShipping, MdCancel } from "react-icons/md";

const AdminOrders = () => {
  const { user, isAdmin } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/pedidos/todos');
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

  const getStatusIcon = (status: string) => {
    switch(status.toLowerCase()) {
      case 'entregado': return <MdCheckCircle className="text-success" />;
      case 'en proceso': return <MdPending className="text-primary" />;
      case 'enviado': return <MdLocalShipping className="text-info" />;
      case 'cancelado': return <MdCancel className="text-error" />;
      default: return <MdPending className="text-warning" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status.toLowerCase()) {
      case 'entregado': return 'bg-success/20 text-success';
      case 'en proceso': return 'bg-primary/20 text-primary';
      case 'enviado': return 'bg-info/20 text-info';
      case 'cancelado': return 'bg-error/20 text-error';
      default: return 'bg-warning/20 text-warning';
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Pedidos</h1>
          <p className="text-base-content/50 font-bold uppercase tracking-widest text-xs mt-1">Gestión de ordenes y envíos</p>
        </div>
        <div className="flex gap-2">
          <div className="join">
            <input className="input input-bordered join-item bg-base-200 text-sm font-bold" placeholder="Buscar pedido..." />
            <button className="btn btn-primary join-item"><MdSearch size={20}/></button>
          </div>
          <button className="btn btn-ghost btn-square bg-base-200">
            <MdFilterList size={20} />
          </button>
        </div>
      </div>

      <div className="bg-base-200 rounded-3xl border border-base-content/20 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-10 flex justify-center"><span className="loading loading-spinner text-primary"></span></div>
          ) : (
            <table className="table table-zebra w-full">
              <thead>
                <tr className="bg-base-300/50 border-b border-base-content/20">
                  <th className="uppercase tracking-widest text-[10px] font-black opacity-50 py-6">Pedido</th>
                  <th className="uppercase tracking-widest text-[10px] font-black opacity-50">Cliente</th>
                  <th className="uppercase tracking-widest text-[10px] font-black opacity-50">Fecha</th>
                  <th className="uppercase tracking-widest text-[10px] font-black opacity-50">Estado</th>
                  <th className="uppercase tracking-widest text-[10px] font-black opacity-50 text-right">Total</th>
                  <th className="uppercase tracking-widest text-[10px] font-black opacity-50 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral/5">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-base-300/30 transition-colors">
                    <td className="font-black">#{order.id}</td>
                    <td>
                      <div>
                        <p className="font-bold text-sm">{order.cliente}</p>
                        <p className="text-[10px] opacity-60">{order.email}</p>
                      </div>
                    </td>
                    <td className="text-xs font-bold opacity-70">
                      {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.estado)}
                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${getStatusBadge(order.estado)}`}>
                          {order.estado}
                        </span>
                      </div>
                    </td>
                    <td className="font-black text-right text-base">
                      {formatPrice(order.total)}
                    </td>
                    <td className="text-center">
                      <button className="btn btn-xs btn-primary font-bold uppercase tracking-wider">Ver Detalle</button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-10 opacity-50 font-bold uppercase tracking-widest">
                      No hay pedidos todavía
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
