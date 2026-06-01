import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const AdminCategories = () => {
  const { user, isAdmin } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ nombre: "", descripcion: "" });

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categorias');
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/categorias/${editingId}`, formData);
      } else {
        await api.post('/categorias', formData);
      }
      fetchCategories();
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ nombre: "", descripcion: "" });
    } catch (error) {
      console.error("Error creating/updating category:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta categoría? Si tiene productos fallará.")) return;
    try {
      await api.delete(`/categorias/${id}`);
      fetchCategories();
    } catch (error: any) {
      alert(error.response?.data?.error || "Error al eliminar categoría.");
    }
  };

  const openEditModal = (cat: any) => {
    setEditingId(cat.id);
    setFormData({ nombre: cat.nombre, descripcion: cat.descripcion || "" });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ nombre: "", descripcion: "" });
    setIsModalOpen(true);
  };

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-base-content">Categorías</h1>
          <p className="text-base-content/60 font-medium text-sm mt-1">Administración y configuración de categorías</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary font-bold rounded-lg shadow-sm hover:shadow-md transition-all">
          Nueva Categoría
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           <div className="col-span-full p-10 flex justify-center"><span className="loading loading-spinner text-primary"></span></div>
        ) : (
          categories.map(cat => (
            <div key={cat.id} className="bg-base-100 p-6 rounded-xl border border-base-content/20 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
              <div>
                <h3 className="text-xl font-bold text-base-content">{cat.nombre}</h3>
                <p className="text-sm text-base-content/60 mt-2 break-all">{cat.descripcion || "Sin descripción"}</p>
              </div>
              <div className="mt-6 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleDelete(cat.id)} className="btn btn-sm btn-ghost text-error hover:bg-error/10">Eliminar</button>
                <button onClick={() => openEditModal(cat)} className="btn btn-sm btn-outline btn-primary">Editar</button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral/80 backdrop-blur-sm">
          <div className="bg-base-100 w-full max-w-md rounded-2xl shadow-xl border border-base-content/20 overflow-hidden">
            <div className="bg-base-200/50 p-6 flex justify-between items-center border-b border-base-content/20">
              <h3 className="text-lg font-bold text-base-content">
                {editingId ? "Editar Categoría" : "Nueva Categoría"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-ghost btn-circle btn-sm text-base-content/70 hover:bg-base-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
               <div className="form-control">
                  <label className="label text-sm font-semibold opacity-70">Nombre</label>
                  <input 
                    required
                    type="text" 
                    value={formData.nombre} 
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="input input-bordered bg-base-100 border-base-content/20 focus:border-primary" 
                  />
               </div>
               <div className="form-control">
                  <label className="label text-sm font-semibold opacity-70">Descripción</label>
                  <textarea 
                    rows={3}
                    value={formData.descripcion} 
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    className="textarea textarea-bordered bg-base-100 border-base-content/20 focus:border-primary resize-none"
                  ></textarea>
               </div>
               <div className="flex justify-end gap-3 pt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost font-semibold">Cancelar</button>
                  <button type="submit" className="btn btn-primary font-semibold">
                    {editingId ? "Guardar Cambios" : "Crear Categoría"}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
