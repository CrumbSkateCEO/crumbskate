import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const UserDropDown = () => {
  const { user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggle = () => setOpen((prev) => !prev);

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!ref.current?.contains(e.relatedTarget as Node)) {
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
        className={`btn btn-ghost btn-circle text-base-content hover:bg-primary/10 ${user ? "text-base-content" : ""}`}
        onClick={toggle}
        onKeyDown={(e) => e.key === "Enter" && toggle()}
      >
        <div className="flex items-center gap-2">
          {user && (
            <span className="text-[10px] font-impact uppercase tracking-[0.2em] hidden md:block text-base-content">
              {user.nombre}
            </span>
          )}
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

      {open &&
        (user ? (
          <ul
            tabIndex={0}
            className="dropdown-content z-50 menu p-2 bg-base-200 border-4 border-black shadow-brutal w-56"
          >
            <li className="px-4 py-2 border-b-2 border-base-300">
              <p className="text-[10px] font-impact uppercase tracking-[0.2em] text-base-content/40 leading-none">
                Conectado como
              </p>
              <p className="text-xs font-mono font-bold uppercase truncate text-base-content">
                {user.email}
              </p>
            </li>
            {isAdmin && (
              <li>
                <Link
                  to="/admin"
                  className="text-warning font-impact uppercase text-xs tracking-wider hover:bg-primary/10 rounded-none"
                  onClick={() => setOpen(false)}
                >
                  Panel de Admin
                </Link>
              </li>
            )}
            <li>
              <Link
                to="/perfil"
                className="font-impact uppercase text-xs tracking-wider text-base-content hover:bg-primary/10 rounded-none"
                onClick={() => setOpen(false)}
              >
                Mi Perfil
              </Link>
            </li>
            <li className="mt-1 border-t-2 border-base-300 pt-1">
              <button
                className="text-error font-impact uppercase text-xs tracking-wider hover:bg-error/10 rounded-none"
                onClick={handleLogout}
              >
                Cerrar Sesion
              </button>
            </li>
          </ul>
        ) : (
          <ul
            tabIndex={0}
            className="dropdown-content z-50 menu p-2 bg-base-200 border-4 border-black shadow-brutal w-56"
          >
            <li>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="font-impact uppercase text-xs tracking-wider text-base-content hover:bg-primary/10 rounded-none"
              >
                Iniciar Sesion
              </Link>
            </li>
            <li>
              <Link
                to="/registro"
                onClick={() => setOpen(false)}
                className="font-impact uppercase text-xs tracking-wider text-base-content hover:bg-primary/10 rounded-none"
              >
                Registrarse
              </Link>
            </li>
          </ul>
        ))}
    </div>
  );
};

export default UserDropDown;
