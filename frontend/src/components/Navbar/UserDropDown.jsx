const UserDropDown = () => {
  const isLoggedIn = false; // Cambiar a true cuando se implemente autenticación

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost">
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
      {isLoggedIn ? (
        <ul
          tabIndex={0}
          className="dropdown-content z-50 menu p-2 shadow bg-base-200 rounded-box w-52"
        >
          <li>
            <a href="/perfil">Mi Perfil</a>
          </li>
          <li>
            <a href="/pedidos">Mis Pedidos</a>
          </li>
          <li>
            <a href="/lista-deseos">Lista de Deseos</a>
          </li>
          <li>
            <a href="/configuracion">Configuración</a>
          </li>
          <li>
            <a href="/cerrar-sesion">Cerrar Sesión</a>
          </li>
        </ul>
      ) : (
        <ul
          tabIndex={0}
          className="dropdown-content z-50 menu p-2 shadow bg-base-200 rounded-box w-52"
        >
          <li>
            <a href="/login">Iniciar Sesión</a>
          </li>
          <li>
            <a href="/registro">Registrarse</a>
          </li>
        </ul>
      )}
    </div>
  );
};

export default UserDropDown;
