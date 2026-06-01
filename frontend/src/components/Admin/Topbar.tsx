import { useAuth } from "../../context/AuthContext";
import { MdNotifications, MdOpenInNew, MdMenu } from "react-icons/md";
import { Link } from "react-router-dom";

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar = ({ onMenuClick }: TopbarProps) => {
  const { user } = useAuth();

  return (
    <div className="h-20 px-6 bg-base-100 border-b border-base-content/20 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden btn btn-ghost btn-square btn-sm"
          onClick={onMenuClick}
        >
          <MdMenu size={24} />
        </button>
        <div className="hidden md:block">
          {/* Breadcrumb u otro elemento podría ir aquí, por ahora vacío para limpiar */}
        </div>
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
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-base-100"></span>
          </div>
          <ul tabIndex={0} className="dropdown-content z-50 menu p-4 mt-3 bg-base-100 border border-base-content/20 shadow-lg rounded-xl w-64">
            <li><span className="font-semibold text-sm text-base-content/60 block text-center">Sin notificaciones</span></li>
          </ul>
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-base-content/20 ml-2">
          <div className="w-10 h-10 rounded-full bg-primary text-primary-content font-bold font-sans flex items-center justify-center overflow-hidden">
            {user?.nombre ? user.nombre.charAt(0).toUpperCase() : "A"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
