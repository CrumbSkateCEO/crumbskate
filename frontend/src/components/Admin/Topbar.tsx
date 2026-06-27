import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MdNotifications, MdOpenInNew, MdMenu } from "react-icons/md";
import api from "../../services/api";

interface Notificacion {
  id: string;
  tipo: "pedido" | "stock" | "resena";
  mensaje: string;
  link: string;
  created_at: string;
}

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar = ({ onMenuClick }: TopbarProps) => {
  const { user, logout } = useAuth();
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await api.get("/dashboard/notificaciones");
        setNotificaciones(data.notificaciones || []);
      } catch {
        setNotificaciones([]);
      }
    };
    cargar();
    const interval = setInterval(cargar, 60000);
    return () => clearInterval(interval);
  }, []);

  const total = notificaciones.length;

  return (
    <div className="h-16 sm:h-20 px-4 sm:px-6 bg-base-100 border-b border-base-content/20 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          className="lg:hidden btn btn-ghost btn-square touch-manipulation"
          onClick={onMenuClick}
          aria-label="Abrir menú"
        >
          <MdMenu size={24} />
        </button>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <Link
          to="/"
          target="_blank"
          className="hidden md:flex items-center gap-2 text-sm font-bold opacity-70 hover:opacity-100 transition-opacity border border-base-content/20 rounded-lg px-4 py-2 hover:bg-base-200"
        >
          Ver tienda <MdOpenInNew size={16} />
        </Link>

        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="relative btn btn-ghost btn-circle mt-1">
            <MdNotifications size={24} className="opacity-70" />
            {total > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-base-100" />
            )}
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-50 menu p-2 mt-3 bg-base-100 border border-base-content/20 shadow-lg rounded-xl w-72 max-h-80 overflow-y-auto"
          >
            {total === 0 ? (
              <li>
                <span className="font-semibold text-sm text-base-content/60 block text-center py-3">
                  Sin notificaciones
                </span>
              </li>
            ) : (
              notificaciones.map((n) => (
                <li key={n.id}>
                  <Link to={n.link} className="text-sm py-2 whitespace-normal">
                    {n.mensaje}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle p-0 hover:bg-base-200"
            aria-label="Menú de usuario"
          >
            <div className="w-10 h-10 rounded-full bg-primary text-primary-content font-bold font-sans flex items-center justify-center">
              {user?.nombre
                ? user.nombre.charAt(0).toUpperCase()
                : user?.email?.charAt(0).toUpperCase() || "A"}
            </div>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-50 menu p-2 mt-3 bg-base-100 border border-base-content/20 shadow-lg rounded-xl w-56"
          >
            <li className="px-3 py-2 pointer-events-none">
              <p className="text-[10px] font-bold uppercase tracking-wider text-base-content/40">
                Conectado como
              </p>
              <p className="text-xs font-semibold truncate" title={user?.email}>
                {user?.nombre || user?.email}
              </p>
            </li>
            <li>
              <Link to="/perfil" className="text-sm">
                Mi perfil
              </Link>
            </li>
            <li>
              <Link to="/admin/configuracion" className="text-sm">
                Configuración
              </Link>
            </li>
            <li>
              <Link to="/" target="_blank" className="text-sm">
                Ver tienda
              </Link>
            </li>
            <li className="border-t border-base-content/10 mt-1 pt-1">
              <button
                type="button"
                className="text-sm text-error w-full text-left"
                onClick={logout}
              >
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
