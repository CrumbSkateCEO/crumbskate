import { useState, useRef, useEffect, ReactNode } from "react";
import { Link } from "react-router-dom";
import Cart from "./ModalCart";
import UserDropDown from "./UserDropDown";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.svg";

// Datos de ejemplo para el dropdown de búsqueda
const searchSuggestions = [
  { type: "producto", name: "Remera Oversize", category: "Remeras" },
  { type: "producto", name: "Zapatillas Vans", category: "Zapatillas" },
  { type: "producto", name: "Gorra Snapback", category: "Gorras" },
  { type: "categoria", name: "Buzos", category: "Ver todo" },
  { type: "categoria", name: "Pantalones", category: "Ver todo" },
  { type: "categoria", name: "Accesorios", category: "Ver todo" },
];

const cautionText =
  "CRUMBSKATE \u26A0 SKATE OR DIE \u26A0 CULTURA URBANA \u26A0 STREET STYLE \u26A0 ";

const Navbar = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSuggestions = searchSuggestions.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="drawer">
      <input
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={drawerOpen}
        onChange={() => setDrawerOpen(!drawerOpen)}
      />
      <div className="drawer-content flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 w-full">
          {/* CAUTION TAPE MARQUEE */}
          <div className="w-full bg-primary -rotate-0 overflow-hidden border-b-4 border-black relative">
            <div className="caution-marquee py-1">
              {[...Array(8)].map((_, i) => (
                <span
                  key={i}
                  className="font-impact text-primary-content text-xs md:text-sm tracking-[0.3em] uppercase px-4 inline-block"
                >
                  {cautionText}
                </span>
              ))}
            </div>
          </div>

          <nav className="navbar bg-base-300 border-b-4 border-black w-full mb-0 px-2 sm:px-4 md:px-8 min-h-0 py-2">
            {/* Mobile: Logo + Buscador + Menu */}
            <div className="navbar-start flex-auto flex items-center gap-1.5 sm:gap-2 w-full lg:hidden">
              <Link
                to="/"
                className="flex items-center justify-center hover:scale-105 transition-transform origin-center shrink-0"
              >
                <img
                  src={logo}
                  alt="CrumbSkate Logo"
                  className="h-8 w-8 sm:h-10 sm:w-10 object-contain invert brightness-200"
                />
              </Link>

              {/* Buscador móvil */}
              <div className="relative flex-1 min-w-0" ref={searchRef}>
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="input w-full bg-base-200 border-2 border-primary/30 focus:border-primary text-base-content placeholder:text-base-content/30 transition-all pr-8 rounded-none text-xs sm:text-sm h-8 sm:h-10 font-mono"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                />
                <button className="absolute right-0.5 top-1/2 -translate-y-1/2 btn btn-ghost btn-circle btn-xs text-base-content hover:text-accent">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 opacity-70"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>

                {/* Dropdown de sugerencias */}
                {showDropdown && searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-base-200 border-2 border-primary/40 shadow-brutal-sm z-50 max-h-80 overflow-y-auto">
                    {filteredSuggestions.length > 0 ? (
                      filteredSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-4 py-3 hover:bg-primary/10 cursor-pointer flex items-center justify-between transition-colors border-b border-base-300"
                          onClick={() => {
                            setSearchQuery(suggestion.name);
                            setShowDropdown(false);
                          }}
                        >
                          <div>
                            <p className="font-bold text-base-content font-mono text-sm">
                              {suggestion.name}
                            </p>
                            <p className="text-xs text-base-content/60 uppercase font-mono">
                              {suggestion.type}
                            </p>
                          </div>
                          <span className="text-[10px] font-impact tracking-wider bg-primary/10 text-base-content px-2 py-0.5 border border-primary/30">
                            {suggestion.category}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-base-content/60 text-center font-mono text-sm">
                        Sin resultados
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop: Logo + buscador a la izquierda */}
            <div className="navbar-start hidden lg:flex items-center gap-4 flex-1 min-w-0">
              <Link
                to="/"
                className="flex items-center gap-3 hover:scale-105 transition-transform origin-center shrink-0 group"
              >
                <img
                  src={logo}
                  alt="CrumbSkate Logo"
                  className="h-12 w-12 object-contain invert brightness-200 group-hover:drop-shadow-[0_0_8px_rgba(139,26,26,0.6)] transition-all"
                />
                <span className="font-impact text-base-content text-xl tracking-[0.2em] uppercase hidden xl:block group-hover:text-accent transition-colors">
                  CRUMBSKATE
                </span>
              </Link>
              <div className="relative w-full max-w-2xl" ref={searchRef}>
                <input
                  type="text"
                  placeholder="BUSCAR PRODUCTOS, CATEGORÍAS O MARCAS..."
                  className="input w-full bg-base-200 border-2 border-primary/30 focus:border-primary text-base-content placeholder:text-base-content/20 transition-all pr-10 rounded-none font-mono text-xs tracking-wider"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                />
                <button className="absolute right-1 top-1/2 -translate-y-1/2 btn btn-ghost btn-circle btn-sm text-base-content hover:text-accent">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 opacity-70"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>

                {/* Dropdown de sugerencias */}
                {showDropdown && searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-base-200 border-2 border-primary/40 shadow-brutal-sm z-50 max-h-80 overflow-y-auto">
                    {filteredSuggestions.length > 0 ? (
                      filteredSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-4 py-3 hover:bg-primary/10 cursor-pointer flex items-center justify-between transition-colors border-b border-base-300"
                          onClick={() => {
                            setSearchQuery(suggestion.name);
                            setShowDropdown(false);
                          }}
                        >
                          <div>
                            <p className="font-bold text-base-content font-mono text-sm">
                              {suggestion.name}
                            </p>
                            <p className="text-xs text-base-content/60 uppercase font-mono">
                              {suggestion.type}
                            </p>
                          </div>
                          <span className="text-[10px] font-impact tracking-wider bg-primary/10 text-base-content px-2 py-0.5 border border-primary/30">
                            {suggestion.category}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-base-content/60 text-center font-mono text-sm">
                        Sin resultados
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop: Botones a la derecha */}
            <div className="navbar-end gap-2 hidden lg:flex w-auto">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="btn btn-ghost font-impact text-base-content tracking-wider text-xs uppercase hover:bg-primary/10 rounded-none border-2 border-transparent hover:border-primary/30"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/registro"
                    className="btn bg-primary text-primary-content font-impact tracking-wider text-xs uppercase rounded-none border-2 border-black shadow-brutal-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                  >
                    Registrarse
                  </Link>
                </>
              ) : null}
              <ThemeSwitcher />
              <UserDropDown />
              <Cart />
            </div>

            {/* Mobile menu button */}
            <div className="navbar-end lg:hidden shrink-0">
              <label
                htmlFor="my-drawer"
                className="btn btn-square btn-ghost btn-sm sm:btn-md text-base-content hover:bg-primary/10"
              >
                <svg
                  className="swap-off fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 512 512"
                >
                  <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
                </svg>
              </label>
            </div>
          </nav>
        </header>
        <div className="flex-1 flex flex-col">{children}</div>
      </div>

      {/* Drawer lateral para móvil */}
      <div className="drawer-side z-50">
        <label
          htmlFor="my-drawer"
          className="drawer-overlay"
          onClick={() => setDrawerOpen(false)}
        ></label>
        <ul className="menu p-4 w-64 sm:w-80 min-h-full bg-concrete text-base-content gap-2 border-r-4 border-primary">
          {/* Botón de cerrar */}
          <li className="mb-4">
            <button
              onClick={() => setDrawerOpen(false)}
              className="btn btn-square btn-ghost btn-sm absolute right-2 top-2 text-base-content hover:text-accent"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </li>
          {!user ? (
            <>
              <li className="mt-8">
                <Link
                  to="/login"
                  onClick={() => setDrawerOpen(false)}
                  className="font-impact text-lg tracking-wider uppercase text-base-content hover:text-primary-content hover:bg-primary rounded-none transition-all"
                >
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link
                  to="/registro"
                  onClick={() => setDrawerOpen(false)}
                  className="font-impact text-lg tracking-wider uppercase text-base-content hover:text-primary-content hover:bg-primary rounded-none transition-all"
                >
                  Registrarse
                </Link>
              </li>
            </>
          ) : (
            <li className="mt-8 px-4">
              <div className="flex flex-col items-start gap-1">
                <span className="text-[10px] font-impact uppercase tracking-widest text-primary">BIENVENIDO</span>
                <span className="font-impact text-xl tracking-tight uppercase truncate max-w-full text-base-content">
                  {user.nombre}
                </span>
              </div>
            </li>
          )}
          <li>
            <div onClick={() => setDrawerOpen(false)}>
              <UserDropDown />
            </div>
          </li>
          <li>
            <div onClick={() => setDrawerOpen(false)}>
              <Cart />
            </div>
          </li>
          <li className="mt-4 border-t-2 border-base-300 pt-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-impact uppercase tracking-wider text-base-content/50">
                Tema
              </span>
              <ThemeSwitcher />
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
