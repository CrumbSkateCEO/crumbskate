import { useState, useEffect } from "react";
import api from "../../services/api";
import { MdVisibility, MdVisibilityOff, MdDelete } from "react-icons/md";

const AdminReviews = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get('/resenas');
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const toggleStatus = async (id: number, currentStatus: number) => {
    try {
      await api.put(`/resenas/${id}/estado`, { aprobado: currentStatus ? 0 : 1 });
      setReviews(reviews.map(r => r.id === id ? { ...r, aprobado: currentStatus ? 0 : 1 } : r));
    } catch (error) {
      console.error("Error toggling review", error);
    }
  };

  const handleDelete = async (id: number) => {
    if(confirm("¿Eliminar reseña permanentemente?")) {
      try {
        await api.delete(`/resenas/${id}`);
        setReviews(reviews.filter(r => r.id !== id));
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-8">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tighter italic">Reseñas</h1>
        <p className="text-base-content/50 font-bold uppercase tracking-widest text-xs mt-1">Moderación de comentarios de clientes</p>
      </div>

      <div className="bg-base-200 rounded-3xl border border-base-content/20 shadow-2xl overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center"><span className="loading loading-spinner text-primary"></span></div>
        ) : (
          <table className="table w-full">
            <thead>
              <tr className="bg-base-300/50 border-b border-base-content/20">
                <th className="uppercase tracking-widest text-[10px] font-black opacity-50 py-6">Usuario</th>
                <th className="uppercase tracking-widest text-[10px] font-black opacity-50">Producto</th>
                <th className="uppercase tracking-widest text-[10px] font-black opacity-50">Calificación</th>
                <th className="uppercase tracking-widest text-[10px] font-black opacity-50">Comentario</th>
                <th className="uppercase tracking-widest text-[10px] font-black opacity-50 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id} className={`hover:bg-base-300/50 transition-colors ${!r.aprobado ? 'opacity-50' : ''}`}>
                  <td className="font-bold">{r.usuario}</td>
                  <td className="font-bold text-primary">{r.producto}</td>
                  <td className="text-warning text-lg tracking-widest">
                    {'★'.repeat(r.calificacion)}{'☆'.repeat(5-r.calificacion)}
                  </td>
                  <td className="text-sm max-w-xs truncate">{r.comentario}</td>
                  <td className="text-right space-x-2">
                    <button 
                      onClick={() => toggleStatus(r.id, r.aprobado)} 
                      className={`btn btn-sm btn-circle ${r.aprobado ? 'btn-ghost' : 'btn-warning'}`}
                      title={r.aprobado ? 'Ocultar' : 'Mostrar'}
                    >
                      {r.aprobado ? <MdVisibility /> : <MdVisibilityOff />}
                    </button>
                    <button onClick={() => handleDelete(r.id)} className="btn btn-sm btn-circle btn-ghost text-error">
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
