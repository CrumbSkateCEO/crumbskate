import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "../services/api";

interface ConfigContextType {
  config: { [key: string]: string };
  loading: boolean;
  refreshConfig: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
};

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/configuracion");
      setConfig(data);
    } catch (error) {
      console.error("Error fetching config:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, loading, refreshConfig: fetchConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};
