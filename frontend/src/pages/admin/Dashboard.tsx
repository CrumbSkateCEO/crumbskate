import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";
import api from "../../services/api";
import { getAssetUrl } from "../../utils/assets";
import { 
  MdShoppingBag, 
  MdShoppingCart, 
  MdAttachMoney, 
  MdInventory,
  MdTrendingUp,
  MdMoreVert
} from "react-icons/md";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const Dashboard = () => {
  const { products } = useProducts();
  const [stats, setStats] = useState({
    totalVentas: 0,
    totalPedidos: 0,
    ticketPromedio: 0,
    pedidosRecientes: [] as any[]
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };
    fetchStats();
  }, []);

  // Datos mockeados para los gráficos (pendiente en el backend)
  const salesData = [
    { name: '22 Abr', ventas: 500 },
    { name: '25 Abr', ventas: 800 },
    { name: '29 Abr', ventas: 600 },
    { name: '2 May', ventas: 1200 },
    { name: '6 May', ventas: 1500 },
    { name: '10 May', ventas: 900 },
    { name: '13 May', ventas: 1100 },
    { name: '17 May', ventas: 1800 },
    { name: '20 May', ventas: 2500 },
  ];

  const channelData = [
    { name: 'Tienda online', value: 65, color: '#7c3aed' },
    { name: 'Instagram', value: 20, color: '#db2777' },
    { name: 'YouTube', value: 10, color: '#ff0000' },
    { name: 'Otros', value: 5, color: '#f59e0b' },
  ];

  const formatPrice = (n: number) => 
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

  const StatCard = ({ title, value, icon, trend, isPositive }: any) => (
    <div className="bg-base-200 p-6 rounded-2xl border border-base-content/20 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-base-300 rounded-xl">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold opacity-70 mb-1">{title}</p>
        <h3 className="text-3xl font-bold">{value}</h3>
      </div>
      {trend && (
        <div className={`flex items-center gap-1 mt-4 text-xs font-bold ${isPositive ? 'text-success' : 'text-error'}`}>
          <MdTrendingUp className={!isPositive ? 'rotate-180' : ''} />
          <span>{trend}</span>
          <span className="text-base-content/40 ml-1">vs mes anterior</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm font-medium opacity-70 mt-1">Resumen general de tu tienda</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Ventas totales" 
          value={formatPrice(stats.totalVentas)} 
          icon={<MdShoppingBag size={24} className="text-primary" />} 
        />
        <StatCard 
          title="Pedidos" 
          value={stats.totalPedidos.toString()} 
          icon={<MdShoppingCart size={24} className="text-info" />} 
        />
        <StatCard 
          title="Ticket promedio" 
          value={formatPrice(stats.ticketPromedio)} 
          icon={<MdAttachMoney size={24} className="text-success" />} 
        />
        <StatCard 
          title="Productos" 
          value={products.length.toString()} 
          icon={<MdInventory size={24} className="text-warning" />} 
        />
      </div>

      {/* Charts Row - Oculto hasta tener datos reales del backend */}
      {/* 
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      ... 
      </div> 
      */}

      {/* Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-base-200 p-6 rounded-2xl border border-base-content/20 shadow-sm overflow-hidden flex flex-col">
          <h3 className="font-semibold text-lg mb-6">Pedidos recientes</h3>
          <div className="overflow-x-auto flex-1">
            <table className="table table-sm w-full">
              <thead>
                <tr className="border-b border-base-content/20 opacity-60 text-xs">
                  <th># Pedido</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral/5">
                {stats.pedidosRecientes.map((order) => (
                  <tr key={order.id} className="hover:bg-base-300/50 transition-colors">
                    <td className="font-bold">#{order.id}</td>
                    <td className="font-bold flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary">
                        {order.cliente?.charAt(0)}
                      </div>
                      {order.cliente}
                    </td>
                    <td className="text-xs opacity-70">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                        order.estado === 'entregado' ? 'bg-success/20 text-success' :
                        order.estado === 'enviado' ? 'bg-info/20 text-info' :
                        order.estado === 'en proceso' ? 'bg-primary/20 text-primary' :
                        'bg-warning/20 text-warning'
                      }`}>
                        {order.estado}
                      </span>
                    </td>
                    <td className="font-black text-right">{formatPrice(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link to="/admin/pedidos" className="text-primary font-bold text-sm uppercase tracking-wider mt-4 hover:underline text-center w-full block">
            Ver todos los pedidos
          </Link>
        </div>

        {/* Top Products */}
        <div className="bg-base-200 p-6 rounded-2xl border border-base-content/20 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Top productos</h3>
            <select className="select select-sm select-bordered bg-base-100 font-medium">
              <option>Más vendidos</option>
              <option>Más vistos</option>
            </select>
          </div>
          <div className="space-y-4 flex-1">
            {products.slice(0, 5).map((product, idx) => (
              <div key={product.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-base-300/50 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="font-bold opacity-40 w-4 text-center">{idx + 1}</span>
                  <div className="w-10 h-10 rounded bg-base-100 border border-base-content/20 overflow-hidden">
                    {product.image ? (
                      <img src={getAssetUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-neutral/5">CS</div>
                    )}
                  </div>
                  <span className="font-bold text-sm truncate max-w-[150px]">{product.name}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-bold text-sm w-20 text-right">{formatPrice(product.price)}</span>
                </div>
              </div>
            ))}
          </div>
          <Link to="/admin/productos" className="text-primary font-bold text-sm uppercase tracking-wider mt-4 hover:underline text-center w-full block">
            Ver todos los productos
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
