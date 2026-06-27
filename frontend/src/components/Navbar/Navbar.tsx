import { useState, useRef, useEffect, ReactNode } from "react";
import { Link } from "react-router-dom";
import Cart from "./ModalCart";
import UserDropDown from "./UserDropDown";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useConfig } from "../../context/ConfigContext";
import logo from "../../assets/logo.svg";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";

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
  "FERNANDO FLOR \u26A0 SANTIAGO MEDINA \u26A0 LIZ BENITEZ \u26A0 JAVIER ROMERO \u26A0 ";

const mobileNavLinkClass =
  "flex items-center gap-2 w-full min-h-9 px-3 py-2 text-[11px] font-mono font-bold uppercase tracking-wide text-base-content/75 hover:bg-base-300 hover:text-base-content active:bg-base-300 rounded-md transition-colors";

const mobileNavLinkAccentClass =
  "flex items-center gap-2 w-full min-h-9 px-3 py-2 text-[11px] font-impact uppercase tracking-wide text-primary hover:bg-primary/10 active:bg-primary/10 rounded-md transition-colors";

const Navbar = ({ children }: { children: ReactNode }) => {
  const { user, logout, isAdmin } = useAuth();
  const { cartItems } = useCart();
  const { config } = useConfig();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const closeDrawer = () => setDrawerOpen(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // Cerrar dropdown al hacer click fuera (mobile y desktop)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const outsideMobile =
        !mobileSearchRef.current || !mobileSearchRef.current.contains(target);
      const outsideDesktop =
        !desktopSearchRef.current || !desktopSearchRef.current.contains(target);
      if (outsideMobile && outsideDesktop) {
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
    <div className="drawer drawer-end">
      <input
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={drawerOpen}
        readOnly
        aria-hidden
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
              <div className="relative flex-1 min-w-0" ref={mobileSearchRef}>
                <input
                  ref={mobileSearchInputRef}
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
                <button
                  onClick={() => mobileSearchInputRef.current?.focus()}
                  className="absolute right-0.5 top-1/2 -translate-y-1/2 btn btn-ghost btn-circle btn-xs text-base-content hover:text-accent"
                >
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
              <div className="relative w-full max-w-2xl" ref={desktopSearchRef}>
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

            {/* Mobile: carrito + menú */}
            <div className="navbar-end lg:hidden shrink-0 flex items-center gap-0.5">
              <Link
                to="/carrito"
                className="btn btn-ghost btn-circle btn-sm relative text-base-content hover:bg-primary/10 touch-manipulation"
                aria-label="Ver carrito"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-error text-error-content text-[9px] font-impact min-w-[18px] h-[18px] flex items-center justify-center border-2 border-black">
                    {itemCount}
                  </span>
                )}
              </Link>
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="btn btn-square btn-ghost btn-sm sm:btn-md text-base-content hover:bg-primary/10 touch-manipulation"
                aria-label="Abrir menú"
              >
                <svg
                  className="fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 512 512"
                >
                  <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
                </svg>
              </button>
            </div>
          </nav>
        </header>
        <div className="flex-1 flex flex-col">{children}</div>
      </div>

      {/* Drawer móvil — se abre desde la derecha (junto al hamburguesa) */}
      <div className="drawer-side z-[60]">
        <button
          type="button"
          className="drawer-overlay"
          aria-label="Cerrar menú"
          onClick={closeDrawer}
        />
        <aside className="w-56 sm:w-60 min-h-full bg-base-100 text-base-content border-l-2 border-base-300 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-b border-base-300">
            <span className="font-impact text-[11px] uppercase tracking-[0.25em] text-base-content">
              Menú
            </span>
            <button
              type="button"
              onClick={closeDrawer}
              className="btn btn-ghost btn-xs btn-square shrink-0 text-base-content/60 hover:text-base-content hover:bg-base-300 touch-manipulation"
              aria-label="Cerrar menú"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
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
          </div>

          {user && (
            <div className="px-3 py-2 border-b border-base-300 bg-base-200/60">
              <p className="text-[10px] font-impact uppercase tracking-widest text-base-content/40 leading-none mb-0.5">
                {user.nombre || "Mi cuenta"}
              </p>
              <p className="text-[10px] font-mono truncate text-base-content/60" title={user.email}>
                {user.email}
              </p>
            </div>
          )}

          <nav className="flex-1 overflow-y-auto py-2 px-2 flex flex-col gap-0.5">
            {!user ? (
              <div className="grid grid-cols-2 gap-1.5 px-1 pb-2 mb-1 border-b border-base-300">
                <Link
                  to="/login"
                  onClick={closeDrawer}
                  className="min-h-9 flex items-center justify-center px-2 py-1.5 text-[10px] font-impact uppercase tracking-wide border border-base-300 bg-base-200 text-base-content hover:bg-base-300 transition-colors touch-manipulation"
                >
                  Entrar
                </Link>
                <Link
                  to="/registro"
                  onClick={closeDrawer}
                  className="min-h-9 flex items-center justify-center px-2 py-1.5 text-[10px] font-impact uppercase tracking-wide bg-primary text-primary-content border border-primary hover:brightness-110 transition-all touch-manipulation"
                >
                  Registro
                </Link>
              </div>
            ) : (
              <>
                <Link to="/perfil" onClick={closeDrawer} className={mobileNavLinkClass}>
                  Mi Perfil
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={closeDrawer} className={mobileNavLinkAccentClass}>
                    Panel Admin
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    closeDrawer();
                  }}
                  className={`${mobileNavLinkClass} text-error/80 hover:text-error hover:bg-error/10 active:bg-error/10`}
                >
                  Salir
                </button>
                <div className="my-1 border-t border-base-300" />
              </>
            )}

            <Link to="/carrito" onClick={closeDrawer} className={mobileNavLinkClass}>
              Carrito
              {itemCount > 0 && (
                <span className="ml-auto min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-primary text-primary-content text-[9px] font-impact rounded-sm">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link to="/#catalogo" onClick={closeDrawer} className={mobileNavLinkClass}>
              Catálogo
            </Link>
            {config?.telefono_contacto && (
              <a
                href={`https://wa.me/${config.telefono_contacto.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeDrawer}
                className={mobileNavLinkClass}
              >
                WhatsApp
              </a>
            )}
          </nav>

          <div className="px-3 py-2 border-t border-base-300 flex items-center justify-between gap-2 bg-base-200/40">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-base-content/40">
              Tema
            </span>
            <ThemeSwitcher />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Navbar;
