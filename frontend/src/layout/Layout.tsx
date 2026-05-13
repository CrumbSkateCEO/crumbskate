import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

const Layout = () => {
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
            <div className="relative z-10">
              <p className="text-2xl md:text-4xl font-impact tracking-[0.15em] md:tracking-[0.3em] uppercase">
                CRUMBSKATE
              </p>
              <p className="text-[10px] md:text-xs font-mono font-bold opacity-60 mt-2 tracking-[0.2em] md:tracking-[0.5em] uppercase">
                Cultura Skater Argentina &copy; 2026
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <span className="inline-block w-3 h-3 bg-primary" />
                <span className="inline-block w-3 h-3 bg-accent" />
                <span className="inline-block w-3 h-3 bg-primary" />
              </div>
            </div>
          </footer>
        </div>
      </Navbar>
    </div>
  );
};

export default Layout;
