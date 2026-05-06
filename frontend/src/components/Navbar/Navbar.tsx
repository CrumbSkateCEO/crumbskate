import { useState, useRef, useEffect, ReactNode } from "react";
import { Link } from "react-router-dom";
import Cart from "./ModalCart";
import UserDropDown from "./UserDropDown";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
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

const Navbar = ({ children }: { children: ReactNode }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
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
          <nav className="navbar bg-base-200 shadow-sm w-full mb-0 px-4 sm:px-6 md:px-8">
            {/* Mobile: Logo + Buscador + Menu */}
            <div className="navbar-start flex-auto flex items-center gap-2 w-full lg:hidden">
              <Link
                to="/"
                className="flex items-center justify-center hover:scale-105 transition-transform origin-center shrink-0"
              >
                <img
                  src={logo}
                  alt="CrumbSkate Logo"
                  className="h-10 w-10 object-contain"
                />
              </Link>

              {/* Buscador móvil */}
              <div className="relative flex-1 min-w-0" ref={searchRef}>
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="input input-bordered w-full bg-base-100 border-neutral/50 focus:border-primary transition-all pr-8 rounded-full text-sm h-10"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                />
                <button className="absolute right-0.5 top-1/2 -translate-y-1/2 btn btn-ghost btn-circle btn-xs hover:text-primary">
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
                  <div className="absolute top-full left-0 right-0 mt-2 bg-base-200 rounded-xl shadow-xl border border-neutral/30 z-50 max-h-80 overflow-y-auto">
                    {filteredSuggestions.length > 0 ? (
                      filteredSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-4 py-3 hover:bg-base-100 cursor-pointer flex items-center justify-between transition-colors"
                          onClick={() => {
                            setSearchQuery(suggestion.name);
                            setShowDropdown(false);
                          }}
                        >
                          <div>
                            <p className="font-bold text-base-content">
                              {suggestion.name}
                            </p>
                            <p className="text-xs text-base-content/60 uppercase">
                              {suggestion.type}
                            </p>
                          </div>
                          <span className="badge badge-ghost text-xs">
                            {suggestion.category}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-base-content/60 text-center">
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
                className="flex items-center justify-center hover:scale-105 transition-transform origin-center shrink-0"
              >
                <img
                  src={logo}
                  alt="CrumbSkate Logo"
                  className="h-12 w-12 object-contain"
                />
              </Link>
              <div className="relative w-full max-w-2xl" ref={searchRef}>
                <input
                  type="text"
                  placeholder="Buscar productos, categorías o marcas..."
                  className="input input-bordered w-full bg-base-100 border-neutral/50 focus:border-primary transition-all pr-10 rounded-full"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                />
                <button className="absolute right-1 top-1/2 -translate-y-1/2 btn btn-ghost btn-circle btn-sm hover:text-primary">
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
                  <div className="absolute top-full left-0 right-0 mt-2 bg-base-200 rounded-xl shadow-xl border border-neutral/30 z-50 max-h-80 overflow-y-auto">
                    {filteredSuggestions.length > 0 ? (
                      filteredSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-4 py-3 hover:bg-base-100 cursor-pointer flex items-center justify-between transition-colors"
                          onClick={() => {
                            setSearchQuery(suggestion.name);
                            setShowDropdown(false);
                          }}
                        >
                          <div>
                            <p className="font-bold text-base-content">
                              {suggestion.name}
                            </p>
                            <p className="text-xs text-base-content/60 uppercase">
                              {suggestion.type}
                            </p>
                          </div>
                          <span className="badge badge-ghost text-xs">
                            {suggestion.category}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-base-content/60 text-center">
                        Sin resultados
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop: Botones a la derecha */}
            <div className="navbar-end gap-3 hidden lg:flex w-auto">
              <Link to="/login" className="btn btn-ghost font-bold">
                Iniciar Sesión
              </Link>
              <Link
                to="/registro"
                className="btn btn-primary text-primary-content font-bold"
              >
                Registrarse
              </Link>
              <ThemeSwitcher />
              <UserDropDown />
              <Cart />
            </div>

            {/* Mobile menu button */}
            <div className="navbar-end lg:hidden flex-1 justify-end">
              <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
                <svg
                  className="swap-off fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 512 512"
                >
                  <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
                </svg>
              </label>
            </div>
          </nav>
        </header>
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </div>

      {/* Drawer lateral para móvil */}
      <div className="drawer-side z-50">
        <label
          htmlFor="my-drawer"
          className="drawer-overlay"
          onClick={() => setDrawerOpen(false)}
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content gap-2">
          {/* Botón de cerrar */}
          <li className="mb-4">
            <button
              onClick={() => setDrawerOpen(false)}
              className="btn btn-square btn-ghost btn-sm absolute right-2 top-2"
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
          <li className="mt-8">
            <Link
              to="/login"
              onClick={() => setDrawerOpen(false)}
              className="font-bold text-lg"
            >
              Iniciar Sesión
            </Link>
          </li>
          <li>
            <Link
              to="/registro"
              onClick={() => setDrawerOpen(false)}
              className="font-bold text-lg"
            >
              Registrarse
            </Link>
          </li>
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
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
