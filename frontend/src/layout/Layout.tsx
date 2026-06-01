import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { useConfig } from "../context/ConfigContext";
import { FaWhatsapp, FaInstagram, FaEnvelope } from "react-icons/fa";

const Layout = () => {
  const { config } = useConfig();
  return (
    <div className="min-h-screen bg-base-100 text-base-content transition-colors duration-300 w-full flex flex-col font-mono overflow-x-hidden">
      <Navbar>
        <div className="flex-1 flex flex-col">
          <main className="w-full px-4 sm:px-6 lg:px-8 pb-10 flex-1 overflow-x-hidden">
            <Outlet />
          </main>

          <footer className="bg-base-300 border-t-4 border-primary text-base-content py-10 text-center mt-auto w-full relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139,26,26,0.1) 2px, rgba(139,26,26,0.1) 4px)",
              }}
            />
            <div className="relative z-10 flex flex-col items-center">
              <p className="text-2xl md:text-4xl font-impact tracking-[0.15em] md:tracking-[0.3em] uppercase">
                CRUMBSKATE
              </p>
              
              <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs font-mono font-bold uppercase tracking-widest">
                {config.telefono_contacto && (
                  <a href={`https://wa.me/${config.telefono_contacto.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="btn btn-outline btn-circle hover:bg-primary hover:text-primary-content hover:border-primary transition-colors">
                    <FaWhatsapp size={20} />
                  </a>
                )}
                {config.email_contacto && (
                  <a href={`mailto:${config.email_contacto}`} className="btn btn-outline btn-circle hover:bg-primary hover:text-primary-content hover:border-primary transition-colors">
                    <FaEnvelope size={20} />
                  </a>
                )}
                {config.instagram_url && (
                  <a href={config.instagram_url} target="_blank" rel="noreferrer" className="btn btn-outline btn-circle hover:bg-primary hover:text-primary-content hover:border-primary transition-colors">
                    <FaInstagram size={20} />
                  </a>
                )}
              </div>

              <p className="text-[10px] md:text-xs font-mono font-bold opacity-60 mt-8 tracking-[0.2em] md:tracking-[0.5em] uppercase">
                Cultura Skater Argentina &copy; 2026
              </p>
            </div>
          </footer>
        </div>
      </Navbar>
    </div>
  );
};

export default Layout;
