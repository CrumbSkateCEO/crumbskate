import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-base-100 text-base-content transition-colors duration-300 w-full flex flex-col">
      <Navbar>
        <div className="flex-1 flex flex-col">
          <main className="w-full px-4 sm:px-6 lg:px-8 pb-10 flex-1 overflow-x-hidden">
            <Outlet />
          </main>
          
          <footer className="bg-primary text-primary-content py-8 text-center mt-auto w-full">
            <p className="text-xl font-black tracking-widest uppercase italic">Crumbskate</p>
            <p className="text-sm font-bold opacity-80">Cultura Skater Argentina &copy; 2026</p>
          </footer>
        </div>
      </Navbar>
    </div>
  );
};

export default Layout;
