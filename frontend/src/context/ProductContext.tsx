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
      const mappedProducts = data.map((p: any) => {
        const sizes = p.variantes ? p.variantes.map((v: any) => v.talla) : undefined;
        // remove duplicate sizes
        const uniqueSizes = sizes ? [...new Set(sizes)] : undefined;
        const totalStock = p.variantes ? p.variantes.reduce((sum: number, v: any) => sum + v.stock, 0) : 1;
        return {
          id: p.id,
          name: p.nombre,
          description: p.descripcion,
          price: Number(p.precio_base),
          image: p.imagen_url,
          category: p.categoria,
          categoria_id: p.categoria_id,
          gender: p.genero,
          sizes: uniqueSizes,
          variants: p.variantes,
          inStock: totalStock > 0,
          createdAt: p.created_at
        };
      });
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
      const formData = new FormData();
      formData.append('nombre', product.name);
      formData.append('descripcion', product.description);
      formData.append('precio_base', product.price);
      formData.append('categoria_id', product.category); // Now directly the ID from DB
      formData.append('codigo_sku', `SKU-${Date.now()}`);
      formData.append('marca', 'Crumbskate');
      formData.append('genero', product.gender || 'unisex');
      if (product.variants) {
        formData.append('variantes', JSON.stringify(product.variants));
      }
      
      if (product.image instanceof File) {
        formData.append('image', product.image);
      } else if (product.image) {
        formData.append('imagen_url', product.image);
      }

      const { data } = await api.post("/productos", formData);
      fetchProducts(); // Recargar la lista
      return { success: true, id: data.id };
    } catch (error) {
      console.error("Error agregando producto:", error);
      return { success: false };
    }
  };

  const updateProduct = async (id: string | number, updatedFields: any) => {
    try {
      const formData = new FormData();
      formData.append('nombre', updatedFields.name);
      formData.append('descripcion', updatedFields.description);
      formData.append('precio_base', updatedFields.price);
      formData.append('activo', '1');
      formData.append('categoria_id', updatedFields.category);
      formData.append('genero', updatedFields.gender || 'unisex');
      if (updatedFields.variants) {
        formData.append('variantes', JSON.stringify(updatedFields.variants));
      }

      if (updatedFields.image instanceof File) {
        formData.append('image', updatedFields.image);
      } else if (updatedFields.image) {
        formData.append('imagen_url', updatedFields.image);
      }

      await api.put(`/productos/${id}`, formData);
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
