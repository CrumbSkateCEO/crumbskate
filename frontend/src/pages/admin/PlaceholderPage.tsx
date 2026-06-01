import { MdConstruction } from "react-icons/md";
import { useLocation } from "react-router-dom";

const PlaceholderPage = () => {
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const pageName = pathParts[pathParts.length - 1];
  const title = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
        <MdConstruction size={48} />
      </div>
      <h1 className="text-4xl font-black mb-4 tracking-tight uppercase">Módulo {title}</h1>
      <p className="text-base-content/60 max-w-md font-bold">
        Esta sección está actualmente en desarrollo. Pronto podrás gestionar la información relacionada a 
        {" "}<span className="text-primary">{title}</span> desde aquí.
      </p>
      <button 
        onClick={() => window.history.back()}
        className="btn btn-outline mt-8 font-bold uppercase tracking-widest"
      >
        Volver atrás
      </button>
    </div>
  );
};

export default PlaceholderPage;
