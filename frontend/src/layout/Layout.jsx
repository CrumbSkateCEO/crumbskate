import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-base-100 text-base-content transition-colors duration-300 w-full flex flex-col">
      <Navbar>
        <main className="w-full px-4 sm:px-6 lg:px-8 pb-10 flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </Navbar>
    </div>
  );
};

export default Layout;
