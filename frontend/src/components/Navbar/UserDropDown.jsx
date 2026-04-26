import { useState, useRef } from "react";
import { Link } from "react-router-dom";

const UserDropDown = () => {
  const isLoggedIn = false; // Cambiar a true cuando se implemente autenticación
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const toggle = () => setOpen((prev) => !prev);

  const handleBlur = (e) => {
    if (!ref.current?.contains(e.relatedTarget)) {
      setOpen(false);
    }
  };

  return (
    <div className="dropdown dropdown-end" ref={ref} onBlur={handleBlur}>
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost"
        onClick={toggle}
        onKeyDown={(e) => e.key === "Enter" && toggle()}
      >
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

      {open && (
        isLoggedIn ? (
          <ul
            tabIndex={0}
            className="dropdown-content z-50 menu p-2 shadow bg-base-200 rounded-box w-52 border border-neutral/20"
          >
            <li><Link to="/perfil" onClick={() => setOpen(false)}>Mi Perfil</Link></li>
            <li><Link to="/pedidos" onClick={() => setOpen(false)}>Mis Pedidos</Link></li>
            <li><Link to="/lista-deseos" onClick={() => setOpen(false)}>Lista de Deseos</Link></li>
            <li><Link to="/configuracion" onClick={() => setOpen(false)}>Configuración</Link></li>
            <li className="mt-1 border-t border-neutral/20 pt-1">
              <button className="text-error font-bold" onClick={() => setOpen(false)}>
                Cerrar Sesión
              </button>
            </li>
          </ul>
        ) : (
          <ul
            tabIndex={0}
            className="dropdown-content z-50 menu p-2 shadow bg-base-200 rounded-box w-52 border border-neutral/20"
          >
            <li>
              <Link to="/login" onClick={() => setOpen(false)} className="font-bold">
                Iniciar Sesión
              </Link>
            </li>
            <li>
              <Link to="/registro" onClick={() => setOpen(false)} className="font-bold">
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
