import { useState, useEffect } from "react";
import api from "../../services/api";
import { MdEdit, MdSave, MdCancel } from "react-icons/md";

const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(n);

const AdminStock = () => {
  const [stock, setStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  const fetchStock = async () => {
    try {
      const { data } = await api.get('/stock');
      setStock(data);
    } catch (error) {
      console.error("Error fetching stock:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const handleSave = async (id: number) => {
    try {
      await api.put(`/stock/${id}`, { stock: editValue });
      setStock(stock.map(s => s.id === id ? { ...s, stock: editValue } : s));
      setEditingId(null);
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-8">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tighter italic">Control de Stock</h1>
        <p className="text-base-content/50 font-bold uppercase tracking-widest text-xs mt-1">Gestión rápida de inventario por variante</p>
      </div>

      <div className="bg-base-200 rounded-3xl border border-base-content/20 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-10 flex justify-center"><span className="loading loading-spinner text-primary"></span></div>
          ) : (
            <table className="table w-full">
              <thead>
                <tr className="bg-base-300/50 border-b border-base-content/20">
                  <th className="uppercase tracking-widest text-[10px] font-black opacity-50 py-6">Producto</th>
                  <th className="uppercase tracking-widest text-[10px] font-black opacity-50">Talla</th>
                  <th className="uppercase tracking-widest text-[10px] font-black opacity-50">Color</th>
                  <th className="uppercase tracking-widest text-[10px] font-black opacity-50 text-right">Stock Actual</th>
                  <th className="uppercase tracking-widest text-[10px] font-black opacity-50 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral/5">
                {stock.map((item) => (
                  <tr key={item.id} className="hover:bg-base-300/30 transition-colors">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-base-300 flex-shrink-0">
                          {item.imagen_url ? (
                            <img src={item.imagen_url.startsWith('http') ? item.imagen_url : `http://localhost:5000${item.imagen_url}`} alt={item.producto} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs opacity-30">IMG</div>
                          )}
                        </div>
                        <span className="font-bold">{item.producto}</span>
                      </div>
                    </td>
                    <td className="font-bold">{item.talla}</td>
                    <td>{item.color || '-'}</td>
                    <td className="text-right">
                      {editingId === item.id ? (
                        <input 
                          type="number" 
                          className="input input-sm input-bordered w-20 text-right" 
                          value={editValue} 
                          onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                          min="0"
                        />
                      ) : (
                        <span className={`font-black text-lg ${item.stock <= 5 ? 'text-error' : ''}`}>
                          {item.stock}
                        </span>
                      )}
                    </td>
                    <td className="text-center">
                      {editingId === item.id ? (
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleSave(item.id)} className="btn btn-sm btn-circle btn-success text-white"><MdSave /></button>
                          <button onClick={() => setEditingId(null)} className="btn btn-sm btn-circle btn-ghost"><MdCancel /></button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => { setEditingId(item.id); setEditValue(item.stock); }} 
                          className="btn btn-sm btn-ghost btn-circle text-primary"
                        >
                          <MdEdit />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStock;
