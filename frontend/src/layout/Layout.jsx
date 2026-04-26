import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-base-100 text-base-content transition-colors duration-300 w-full flex flex-col">
      <Navbar />
      <main className="w-full px-4 sm:px-6 lg:px-8 flex-1 overflow-x-hidden">
        <Outlet />
      </main>
      <footer className="bg-primary text-primary-content py-6 text-center">
        <p className="text-lg font-black tracking-widest uppercase">
          Crumbskate
        </p>
        <p className="text-sm font-bold opacity-80">
          Cultura Skater Argentina &copy; 2026
        </p>
      </footer>
    </div>
  );
};

export default Layout;
