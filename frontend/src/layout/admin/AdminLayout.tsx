import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/Admin/Sidebar";
import Topbar from "../../components/Admin/Topbar";

const AdminLayout = () => {
  const { user, isAdmin } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Redirigir si no es admin o no hay usuario
  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-base-100 text-base-content overflow-hidden font-sans">
      {/* Overlay para móvil */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar (fijo en desktop, drawer en mobile) */}
      <div 
        className={`fixed lg:static inset-y-0 left-0 z-50 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onMenuClick={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-base-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
