import { useState, useEffect } from "react";
import api from "../../services/api";
import { useConfig } from "../../context/ConfigContext";

const AdminSettings = () => {
  const { refreshConfig } = useConfig();
  const [config, setConfig] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await api.get('/configuracion');
        setConfig(data);
      } catch (error) {
        console.error("Error fetching config:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/configuracion', config);
      await refreshConfig();
      alert("Configuración guardada exitosamente");
    } catch (error) {
      console.error("Error saving config:", error);
      alert("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 flex justify-center"><span className="loading loading-spinner text-primary loading-lg"></span></div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tighter italic">Configuración</h1>
        <p className="text-base-content/50 font-bold uppercase tracking-widest text-xs mt-1">Variables globales de la tienda</p>
      </div>

      <div className="bg-base-200 border-2 border-black/10 rounded-3xl shadow-xl p-8 space-y-8">
        
        {/* Sección Tienda */}
        <section className="space-y-4">
          <h2 className="text-xl font-black uppercase tracking-widest border-b-2 border-black/10 pb-2">Tienda</h2>

          <div className="form-control w-full">
            <label className="label font-black uppercase tracking-widest text-xs opacity-60">Moneda Oficial</label>
            <input 
              type="text" 
              className="input input-lg input-bordered font-bold font-mono" 
              value={config.moneda || ""}
              placeholder="ARS"
              onChange={(e) => setConfig({...config, moneda: e.target.value})}
            />
          </div>
        </section>

        {/* Sección Envíos */}
        <section className="space-y-4">
          <h2 className="text-xl font-black uppercase tracking-widest border-b-2 border-black/10 pb-2">Envíos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control w-full">
              <label className="label font-black uppercase tracking-widest text-xs opacity-60">Costo de Envío Fijo</label>
              <input 
                type="number" 
                className="input input-lg input-bordered font-black text-xl" 
                value={config.costo_envio || ""}
                onChange={(e) => setConfig({...config, costo_envio: e.target.value})}
              />
            </div>
            <div className="form-control w-full">
              <label className="label font-black uppercase tracking-widest text-xs opacity-60">Envío Gratis Desde</label>
              <input 
                type="number" 
                className="input input-lg input-bordered font-black text-xl" 
                value={config.envio_gratis_desde || ""}
                onChange={(e) => setConfig({...config, envio_gratis_desde: e.target.value})}
              />
            </div>
          </div>
        </section>

        {/* Sección Contacto */}
        <section className="space-y-4">
          <h2 className="text-xl font-black uppercase tracking-widest border-b-2 border-black/10 pb-2">Contacto y Redes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control w-full">
              <label className="label font-black uppercase tracking-widest text-xs opacity-60">Link de YouTube</label>
              <input 
                type="url" 
                className="input input-lg input-bordered font-bold font-mono" 
                value={config.youtube_url || ""}
                onChange={(e) => setConfig({...config, youtube_url: e.target.value})}
              />
            </div>
            <div className="form-control w-full">
              <label className="label font-black uppercase tracking-widest text-xs opacity-60">Email</label>
              <input 
                type="email" 
                className="input input-lg input-bordered font-bold font-mono" 
                value={config.email_contacto || ""}
                onChange={(e) => setConfig({...config, email_contacto: e.target.value})}
              />
            </div>
          </div>

          <div className="form-control w-full">
            <label className="label font-black uppercase tracking-widest text-xs opacity-60">Link de Instagram</label>
            <input 
              type="url" 
              className="input input-lg input-bordered font-bold font-mono" 
              value={config.instagram_url || ""}
              onChange={(e) => setConfig({...config, instagram_url: e.target.value})}
            />
          </div>
        </section>

        <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-lg w-full font-black uppercase tracking-widest rounded-xl mt-8">
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
