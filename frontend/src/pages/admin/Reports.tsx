import { useState, useEffect } from "react";
import api from "../../services/api";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const formatPrice = (n: number) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

const AdminReports = () => {
  const [ventasDia, setVentasDia] = useState<any[]>([]);
  const [productosTop, setProductosTop] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resVentas, resTop] = await Promise.all([
          api.get('/reportes/ventas-por-dia'),
          api.get('/reportes/productos-mas-vendidos')
        ]);
        
        // Generate last 30 days
        const last30Days = [];
        for (let i = 29; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          last30Days.push({
            fechaStr: d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' }),
            dateStr: dateStr,
            total_ventas: 0
          });
        }

        // Fill in actual sales
        resVentas.data.forEach((v: any) => {
          // Adjust the date string to avoid timezone offset issues (assuming YYYY-MM-DD from DB)
          const dbDateStr = v.fecha.split('T')[0]; 
          const dayData = last30Days.find(d => d.dateStr === dbDateStr);
          if (dayData) {
            dayData.total_ventas = Number(v.total_ventas);
          }
        });
        
        setVentasDia(last30Days);
        setProductosTop(resTop.data);
      } catch (error) {
        console.error("Error fetching reports", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-20 flex justify-center"><span className="loading loading-spinner text-primary loading-lg"></span></div>;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-8">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tighter italic">Reportes</h1>
        <p className="text-base-content/50 font-bold uppercase tracking-widest text-xs mt-1">Métricas y analíticas avanzadas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Ventas (Area) */}
        <div className="bg-base-200 border border-base-content/20 rounded-3xl shadow-xl p-6">
          <h3 className="font-black uppercase tracking-widest mb-6 opacity-70">Ingresos (Últimos 30 días)</h3>
          <div className="h-80 w-full font-mono text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ventasDia}>
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.2)" />
                <XAxis dataKey="fechaStr" stroke="currentColor" opacity={0.5} tickLine={false} axisLine={false} />
                <YAxis stroke="currentColor" opacity={0.5} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--fallback-b1,oklch(var(--b1)))', border: '1px solid rgba(128,128,128,0.2)', borderRadius: '1rem', fontWeight: 'bold' }}
                  formatter={(value: number) => [formatPrice(value), 'Ingresos']}
                  labelStyle={{ color: 'var(--fallback-bc,oklch(var(--bc)))', opacity: 0.5, marginBottom: '0.5rem' }}
                />
                <Area type="monotone" dataKey="total_ventas" stroke="#ef4444" strokeWidth={4} fillOpacity={1} fill="url(#colorVentas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Productos Más Vendidos (Barras Horizontales) */}
        <div className="bg-base-200 border border-base-content/20 rounded-3xl shadow-xl p-6">
          <h3 className="font-black uppercase tracking-widest mb-6 opacity-70">Top 10 Productos Más Vendidos</h3>
          <div className="h-80 w-full font-mono text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={productosTop} margin={{ left: 50 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(128,128,128,0.2)" />
                <XAxis type="number" stroke="currentColor" opacity={0.5} tickLine={false} axisLine={false} />
                <YAxis dataKey="nombre" type="category" stroke="currentColor" opacity={0.8} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(128,128,128,0.1)'}}
                  contentStyle={{ backgroundColor: 'var(--fallback-b1,oklch(var(--b1)))', border: '1px solid rgba(128,128,128,0.2)', borderRadius: '1rem', fontWeight: 'bold' }}
                  formatter={(value: number) => [`${value} uds`, 'Vendidos']}
                />
                <Bar dataKey="total_vendidos" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
