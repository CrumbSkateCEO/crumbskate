import { useState } from "react";
import Cart from "./ModalCart";
import UserDropDown from "./UserDropDown";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import logo from "../../assets/logo.svg";

const Navbar = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="drawer">
      <input
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={drawerOpen}
        onChange={() => setDrawerOpen(!drawerOpen)}
      />
      <div className="drawer-content">
        <header className="sticky top-0 z-50 w-full">
          <nav className="navbar bg-base-200 shadow-sm w-full mb-0 px-4 sm:px-6 md:px-8">
            <div className="navbar-start w-auto flex items-center">
              <a className="flex items-center justify-center hover:scale-105 transition-transform origin-center" href="/">
                <img src={logo} alt="CrumbSkate Logo" className="h-16 w-16 object-contain" />
              </a>
            </div>
            <div className="navbar-center hidden lg:flex flex-1 px-6 lg:justify-center">
              <div className="relative w-full max-w-lg">
                <input 
                  type="text" 
                  placeholder="Buscar productos, categorías o marcas..." 
                  className="input input-bordered w-full bg-base-100 border-neutral/50 focus:border-primary transition-all pr-12 rounded-full" 
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-circle btn-sm hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="navbar-end gap-3 hidden lg:flex w-auto">
              <a href="/login" className="btn btn-ghost font-bold">
                Iniciar Sesión
              </a>
              <a href="/registro" className="btn btn-primary text-primary-content font-bold">
                Registrarse
              </a>
              <ThemeSwitcher />
              <UserDropDown />
              <Cart />
            </div>
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
        {children}
      </div>
      <div className="drawer-side z-50">
        <label
          htmlFor="my-drawer"
          className="drawer-overlay"
          onClick={() => setDrawerOpen(false)}
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content gap-2">
          <li className="mb-4 mt-2">
            <div className="relative w-full p-0">
              <input 
                type="text" 
                placeholder="Buscar productos..." 
                className="input input-bordered w-full bg-base-100 pr-10 rounded-full" 
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-circle btn-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </li>
          <li>
            <a href="/login" onClick={() => setDrawerOpen(false)} className="font-bold">
              Iniciar Sesión
            </a>
          </li>
          <li>
            <a href="/registro" onClick={() => setDrawerOpen(false)}>
              Registrarse
            </a>
          </li>
          <li>
            <a href="/dashboard" onClick={() => setDrawerOpen(false)}>
              Dashboard
            </a>
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
