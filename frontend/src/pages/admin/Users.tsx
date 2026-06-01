import { useState, useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const AdminUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [tab, setTab] = useState<'clientes' | 'admins'>('clientes');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/usuarios/${tab}`);
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [tab]);

  const toggleRole = async (id: number, currentRole: string) => {
    if (String(id) === String(user?.id)) {
      alert("No puedes cambiar tu propio rol.");
      return;
    }
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if(confirm(`¿Cambiar el rol de este usuario a ${newRole.toUpperCase()}?`)) {
      try {
        await api.put(`/usuarios/${id}/rol`, { rol: newRole });
        fetchUsers();
      } catch (error) {
        console.error("Error updating role", error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-8">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tighter italic">Usuarios</h1>
        <p className="text-base-content/50 font-bold uppercase tracking-widest text-xs mt-1">Gestión de roles y accesos</p>
      </div>

      <div className="tabs tabs-boxed bg-base-200 border-2 border-black/10 rounded-xl inline-block font-black uppercase tracking-widest p-2">
        <button className={`tab ${tab === 'clientes' ? 'tab-active bg-primary text-primary-content' : ''}`} onClick={() => setTab('clientes')}>Clientes</button>
        <button className={`tab ${tab === 'admins' ? 'tab-active bg-primary text-primary-content' : ''}`} onClick={() => setTab('admins')}>Administradores</button>
      </div>

      <div className="bg-base-200 rounded-3xl border border-base-content/20 shadow-2xl overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center"><span className="loading loading-spinner text-primary"></span></div>
        ) : (
          <table className="table w-full">
            <thead>
              <tr className="bg-base-300/50 border-b border-base-content/20">
                <th className="uppercase tracking-widest text-[10px] font-black opacity-50 py-6">Nombre</th>
                <th className="uppercase tracking-widest text-[10px] font-black opacity-50">Email</th>
                <th className="uppercase tracking-widest text-[10px] font-black opacity-50">Fecha Registro</th>
                <th className="uppercase tracking-widest text-[10px] font-black opacity-50 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-base-300/50">
                  <td className="font-bold">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-black">
                        {u.nombre.charAt(0)}
                      </div>
                      {u.nombre}
                    </div>
                  </td>
                  <td className="font-mono text-sm opacity-80">{u.email}</td>
                  <td className="text-xs opacity-70">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="text-right">
                    <button 
                      onClick={() => toggleRole(u.id, u.rol)} 
                      className={`btn btn-xs uppercase font-black tracking-widest ${u.rol === 'admin' ? 'btn-error btn-outline' : 'btn-success btn-outline'}`}
                      disabled={String(u.id) === String(user?.id)}
                    >
                      Hacer {u.rol === 'admin' ? 'Cliente' : 'Admin'}
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

export default AdminUsers;
