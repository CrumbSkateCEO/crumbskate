import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  MdDashboard,
  MdStorefront,
  MdCategory,
  MdShoppingCart,
  MdAttachMoney,
  MdPeople,
  MdCardGiftcard,
  MdInventory,
  MdBarChart,
  MdStarRate,
  MdSettings,
  MdManageAccounts,
  MdLogout,
} from "react-icons/md";

import logo from "../../assets/logo.svg";

const Sidebar = () => {
  const { logout } = useAuth();

  const links = [
    { to: "/admin", icon: <MdDashboard size={20} />, label: "Dashboard", exact: true },
    { to: "/admin/productos", icon: <MdStorefront size={20} />, label: "Productos" },
    { to: "/admin/categorias", icon: <MdCategory size={20} />, label: "Categorías" },
    { to: "/admin/pedidos", icon: <MdShoppingCart size={20} />, label: "Pedidos" },
    { to: "/admin/usuarios", icon: <MdPeople size={20} />, label: "Usuarios" },
    { to: "/admin/cupones", icon: <MdCardGiftcard size={20} />, label: "Cupones" },
    { to: "/admin/stock", icon: <MdInventory size={20} />, label: "Stock" },
    { to: "/admin/reportes", icon: <MdBarChart size={20} />, label: "Reportes" },
    { to: "/admin/resenas", icon: <MdStarRate size={20} />, label: "Reseñas" },
  ];

  const settingsLinks = [
    { to: "/admin/configuracion", icon: <MdSettings size={20} />, label: "Configuración" },
  ];

  return (
    <div className="w-64 h-full bg-base-200 border-r border-base-content/20 flex flex-col font-sans">
      <div className="p-6 border-b border-base-content/20 flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
          <img src={logo} alt="Logo" className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col">
          <span className="font-black text-lg uppercase leading-none tracking-tight text-primary">Crumb Skate</span>
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Administración</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1 custom-scrollbar">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold text-sm ${
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-base-content/70 hover:bg-base-300 hover:text-base-content"
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}

        <div className="divider my-2 before:bg-neutral/10 after:bg-neutral/10"></div>

        {settingsLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold text-sm ${
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-base-content/70 hover:bg-base-300 hover:text-base-content"
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-base-content/20">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error hover:bg-error/10 transition-colors font-bold text-sm"
        >
          <MdLogout size={20} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
