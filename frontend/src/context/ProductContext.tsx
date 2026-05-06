import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "../services/api";
import { Product } from "../types";

interface ProductContextType {
  products: Product[];
  loading: boolean;
  addProduct: (product: any) => Promise<{ success: boolean; id?: number | string }>;
  updateProduct: (id: string | number, updatedFields: any) => Promise<{ success: boolean }>;
  deleteProduct: (id: string | number) => Promise<{ success: boolean }>;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/productos");
      // Mapear los datos del backend al formato que espera el frontend
      const mappedProducts = data.map((p: any) => ({
        id: p.id,
        name: p.nombre,
        description: p.descripcion,
        price: Number(p.precio_base),
        image: p.imagen_url,
        category: p.categoria,
        categoria_id: p.categoria_id, // guardamos el id por si acaso
        inStock: true // asumimos stock por defecto a menos que checkeemos variantes
      }));
      setProducts(mappedProducts);
    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (product: any) => {
    try {
      // Necesitamos mapear de vuelta al backend
      const { data } = await api.post("/productos", {
        nombre: product.name,
        descripcion: product.description,
        precio_base: product.price,
        imagen_url: product.image,
        categoria_id: product.category === 'remeras' ? 1 : 2, // Hardcodeado por ahora para evitar problemas de ID vs string, mejor pasar el ID real desde el form
        // Faltaria codigo_sku y marca
        codigo_sku: `SKU-${Date.now()}`,
        marca: 'Crumbskate'
      });
      fetchProducts(); // Recargar la lista
      return { success: true, id: data.id };
    } catch (error) {
      console.error("Error agregando producto:", error);
      return { success: false };
    }
  };

  const updateProduct = async (id: string | number, updatedFields: any) => {
    try {
      await api.put(`/productos/${id}`, {
        nombre: updatedFields.name,
        descripcion: updatedFields.description,
        precio_base: updatedFields.price,
        imagen_url: updatedFields.image,
        activo: updatedFields.inStock ? 1 : 0
      });
      fetchProducts();
      return { success: true };
    } catch (error) {
      console.error("Error actualizando producto:", error);
      return { success: false };
    }
  };

  const deleteProduct = async (id: string | number) => {
    try {
      await api.delete(`/productos/${id}`);
      fetchProducts();
      return { success: true };
    } catch (error) {
      console.error("Error eliminando producto:", error);
      return { success: false };
    }
  };

  return (
    <ProductContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct, refreshProducts: fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};
