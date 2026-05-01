import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const UserDropDown = () => {
  const { user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const toggle = () => setOpen((prev) => !prev);

  const handleBlur = (e) => {
    if (!ref.current?.contains(e.relatedTarget)) {
      setOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <div className="dropdown dropdown-end" ref={ref} onBlur={handleBlur}>
      <div
        tabIndex={0}
        role="button"
        className={`btn btn-ghost ${user ? 'text-primary' : ''}`}
        onClick={toggle}
        onKeyDown={(e) => e.key === "Enter" && toggle()}
      >
        <div className="flex items-center gap-2">
          {user && <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">{user.name}</span>}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
      </div>

      {open && (
        user ? (
          <ul
            tabIndex={0}
            className="dropdown-content z-50 menu p-2 shadow-xl bg-base-200 rounded-box w-52 border border-neutral/20"
          >
            <li className="px-4 py-2 border-b border-neutral/10">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40 leading-none">Conectado como</p>
              <p className="text-xs font-black uppercase truncate">{user.email}</p>
            </li>
            {isAdmin && (
              <li><Link to="/admin" className="text-primary font-black uppercase text-xs" onClick={() => setOpen(false)}>Panel de Admin</Link></li>
            )}
            <li><Link to="/perfil" className="font-bold uppercase text-xs" onClick={() => setOpen(false)}>Mi Perfil</Link></li>
            <li className="mt-1 border-t border-neutral/20 pt-1">
              <button className="text-error font-black uppercase text-xs" onClick={handleLogout}>
                Cerrar Sesion
              </button>
            </li>
          </ul>
        ) : (
          <ul
            tabIndex={0}
            className="dropdown-content z-50 menu p-2 shadow-xl bg-base-200 rounded-box w-52 border border-neutral/20"
          >
            <li>
              <Link to="/login" onClick={() => setOpen(false)} className="font-black uppercase text-xs">
                Iniciar Sesion
              </Link>
            </li>
            <li>
              <Link to="/registro" onClick={() => setOpen(false)} className="font-black uppercase text-xs">
                Registrarse
              </Link>
            </li>
          </ul>
        )
      )}
    </div>
  );
};

export default UserDropDown;
