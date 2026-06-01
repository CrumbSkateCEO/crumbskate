import { useState, useEffect } from "react";
import api from "../../services/api";
import { MdDelete, MdAdd } from "react-icons/md";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ codigo: "", descuento_porcentaje: "", duracion_dias: "" });

  const fetchCoupons = async () => {
    try {
      const { data } = await api.get('/cupones');
      setCoupons(data);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let valido_hasta = null;
      if (formData.duracion_dias) {
        const d = new Date();
        d.setDate(d.getDate() + parseInt(formData.duracion_dias));
        valido_hasta = d.toISOString().slice(0, 19).replace('T', ' ');
      }
      await api.post('/cupones', {
        codigo: formData.codigo,
        descuento_porcentaje: formData.descuento_porcentaje,
        valido_hasta: valido_hasta
      });
      fetchCoupons();
      setIsModalOpen(false);
      setFormData({ codigo: "", descuento_porcentaje: "", duracion_dias: "" });
    } catch (error: any) {
      alert(error.response?.data?.error || "Error creando cupón");
    }
  };

  const handleDelete = async (id: number) => {
    if(confirm("¿Seguro que deseas eliminar este cupón?")) {
      try {
        await api.delete(`/cupones/${id}`);
        setCoupons(coupons.filter(c => c.id !== id));
      } catch (error) {
        console.error("Error deleting coupon:", error);
      }
    }
  };

  const toggleStatus = async (coupon: any) => {
    try {
      await api.put(`/cupones/${coupon.id}`, { activo: coupon.activo ? 0 : 1 });
      setCoupons(coupons.map(c => c.id === coupon.id ? { ...c, activo: coupon.activo ? 0 : 1 } : c));
    } catch (error) {
      console.error("Error toggling coupon status:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Cupones</h1>
          <p className="text-base-content/50 font-bold uppercase tracking-widest text-xs mt-1">Códigos de descuento</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary font-black uppercase tracking-widest rounded-sm">
          <MdAdd size={20} /> Nuevo Cupón
        </button>
      </div>

      <div className="bg-base-200 rounded-3xl border border-base-content/20 shadow-2xl overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center"><span className="loading loading-spinner text-primary"></span></div>
        ) : (
          <table className="table w-full">
            <thead>
              <tr className="bg-base-300/50 border-b border-base-content/20">
                <th className="uppercase tracking-widest text-[10px] font-black opacity-50 py-6">Código</th>
                <th className="uppercase tracking-widest text-[10px] font-black opacity-50">Descuento</th>
                <th className="uppercase tracking-widest text-[10px] font-black opacity-50">Válido Hasta</th>
                <th className="uppercase tracking-widest text-[10px] font-black opacity-50">Estado</th>
                <th className="uppercase tracking-widest text-[10px] font-black opacity-50 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id}>
                  <td className="font-mono font-bold text-lg">{c.codigo}</td>
                  <td className="font-black text-primary">{c.descuento_porcentaje}%</td>
                  <td className="text-xs opacity-70">{c.valido_hasta ? new Date(c.valido_hasta).toLocaleDateString() : 'Sin límite'}</td>
                  <td>
                    {(() => {
                      const isExpired = c.valido_hasta && new Date(c.valido_hasta) < new Date();
                      if (isExpired) {
                        return <span className="badge border-0 font-bold uppercase text-[10px] bg-warning/20 text-warning">Expirado</span>;
                      }
                      return (
                        <span className={`badge border-0 font-bold uppercase text-[10px] ${c.activo ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                          {c.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="text-center">
                    <button onClick={() => toggleStatus(c)} className={`btn btn-sm btn-ghost ${c.activo ? 'text-warning' : 'text-success'}`}>
                      {c.activo ? 'Desactivar' : 'Activar'}
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="btn btn-sm btn-ghost text-error"><MdDelete size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral/90 backdrop-blur-md">
          <div className="bg-base-200 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 bg-primary text-primary-content font-black uppercase tracking-widest">
              Nuevo Cupón
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="form-control">
                <label className="label text-xs font-bold uppercase opacity-50">Código</label>
                <input required type="text" className="input input-bordered uppercase font-mono font-bold" value={formData.codigo} onChange={e => setFormData({...formData, codigo: e.target.value.toUpperCase()})} />
              </div>
              <div className="form-control">
                <label className="label text-xs font-bold uppercase opacity-50">Descuento (%)</label>
                <input required type="number" min="1" max="100" className="input input-bordered font-bold" value={formData.descuento_porcentaje} onChange={e => setFormData({...formData, descuento_porcentaje: e.target.value})} />
              </div>
              <div className="form-control">
                <label className="label text-xs font-bold uppercase opacity-50">Duración (Días, Opcional)</label>
                <input type="number" min="1" className="input input-bordered font-bold" value={formData.duracion_dias} onChange={e => setFormData({...formData, duracion_dias: e.target.value})} placeholder="Ej: 30" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn flex-1 bg-base-300 font-bold uppercase rounded-sm border-0">Cancelar</button>
                <button type="submit" className="btn flex-1 btn-primary font-bold uppercase rounded-sm">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
