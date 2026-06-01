import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import api from "../../services/api";

const AdminProducts = () => {
  const { user, isAdmin } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    gender: "unisex",
    description: "",
    image: "",
    variants: [{ talla: "Único", stock: 10 }]
  });

  useEffect(() => {
    api.get("/categorias").then(res => setCategories(res.data)).catch(err => console.error(err));
  }, []);

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: "",
      price: "",
      category: categories.length > 0 ? categories[0].id : "",
      gender: "unisex",
      description: "",
      image: "",
      variants: [{ talla: "Único", stock: 10 }]
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      gender: product.gender || "unisex",
      description: product.description || "",
      image: product.image || "",
      variants: product.variants || [{ talla: "Único", stock: 10 }]
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: Number(formData.price)
    };

    if (editingId) {
      await updateProduct(editingId, productData);
    } else {
      await addProduct(productData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string | number) => {
    if (window.confirm("¿Seguro que queres eliminar este producto?")) {
      await deleteProduct(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Panel de Administrador</h1>
          <p className="text-base-content/60 font-medium text-sm mt-1">Gestión de catálogo e inventario</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary font-bold rounded-lg shadow-sm">
          Nuevo Producto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-base-100 p-6 rounded-xl border border-base-content/20 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-semibold opacity-60 mb-2">Total Productos</p>
          <p className="text-3xl font-bold">{products.length}</p>
        </div>
        <div className="bg-base-100 p-6 rounded-xl border border-base-content/20 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-semibold opacity-60 mb-2">Sin Stock</p>
          <p className="text-3xl font-bold text-error">{products.filter(p => !p.inStock).length}</p>
        </div>
        <div className="bg-base-100 p-6 rounded-xl border border-base-content/20 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-semibold opacity-60 mb-2">Categorías</p>
          <p className="text-3xl font-bold text-primary">{categories.length}</p>
        </div>
      </div>

      <div className="bg-base-100 rounded-xl border border-base-content/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-200/50 border-b border-base-content/20 text-base-content/60">
                <th className="font-semibold text-xs py-4">Producto</th>
                <th className="font-semibold text-xs">Categoría</th>
                <th className="font-semibold text-xs">Precio</th>
                <th className="font-semibold text-xs text-center">Stock</th>
                <th className="font-semibold text-xs text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral/10">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-base-200/50 transition-colors group">
                  <td className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-base-200 rounded-md flex items-center justify-center shrink-0 border border-base-content/20 overflow-hidden">
                        {product.image ? (
                          <img 
                            src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`} 
                            alt={product.name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-neutral-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21"/>
                          </svg>
                        )}
                      </div>
                      <div className="max-w-[200px]">
                        <p className="font-semibold text-sm leading-tight truncate">{product.name}</p>
                        <p className="text-xs text-base-content/50 truncate">{product.description || "Sin descripción"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="font-medium text-sm text-base-content/70 capitalize">
                    {product.category}
                  </td>
                  <td className="font-semibold text-sm">
                    {formatPrice(product.price)}
                  </td>
                  <td className="text-center">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${product.inStock ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                      {product.inStock ? 'En Stock' : 'Agotado'}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(product)}
                        className="btn btn-ghost btn-square btn-sm hover:text-primary transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="btn btn-ghost btn-square btn-sm hover:text-error transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal (Add/Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-base-100 w-full max-w-2xl rounded-2xl shadow-xl border border-base-content/20 overflow-hidden my-auto">
            <div className="bg-base-200/50 p-6 flex justify-between items-center border-b border-base-content/20">
              <h3 className="text-lg font-bold text-base-content">
                {editingId ? "Editar Producto" : "Nuevo Producto"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-ghost btn-circle btn-sm text-base-content/70 hover:bg-base-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label text-sm font-semibold opacity-70">Nombre del Producto</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="input input-bordered bg-base-100 border-base-content/20 focus:border-primary" 
                    />
                  </div>
                  <div className="form-control">
                    <label className="label text-sm font-semibold opacity-70">Precio (ARS)</label>
                    <input 
                      required
                      type="number" 
                      value={formData.price} 
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="input input-bordered bg-base-100 border-base-content/20 focus:border-primary" 
                    />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label text-sm font-semibold opacity-70">Categoría</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="select select-bordered bg-base-100 border-base-content/20 focus:border-primary"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label text-sm font-semibold opacity-70">Género</label>
                    <select 
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      className="select select-bordered bg-base-100 border-base-content/20 focus:border-primary"
                    >
                      <option value="unisex">Unisex</option>
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label text-sm font-semibold opacity-70">Imagen</label>
                    <div className="flex items-center gap-3">
                      {formData.image && (
                        <div className="w-10 h-10 bg-base-200 rounded overflow-hidden shrink-0">
                          <img 
                            src={typeof formData.image === 'string' ? (formData.image.startsWith('http') ? formData.image : `http://localhost:5000${formData.image}`) : URL.createObjectURL(formData.image)} 
                            alt="preview" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setFormData({...formData, image: e.target.files[0] as any});
                          }
                        }}
                        className="file-input file-input-bordered file-input-sm w-full bg-base-100 border-base-content/20 focus:border-primary" 
                      />
                    </div>
                  </div>
               </div>

               <div className="form-control">
                  <label className="label text-sm font-semibold opacity-70">Descripción</label>
                  <textarea 
                    rows={3}
                    value={formData.description} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="textarea textarea-bordered bg-base-100 border-base-content/20 focus:border-primary resize-none"
                    placeholder="Detalles del producto..."
                  ></textarea>
               </div>

               <div className="form-control">
                  <div className="flex justify-between items-center mb-2">
                    <label className="label text-sm font-semibold opacity-70 p-0">Variantes (Tallas y Stock)</label>
                    <button 
                      type="button" 
                      onClick={() => setFormData({...formData, variants: [...formData.variants, { talla: "Nueva", stock: 0 }]})}
                      className="btn btn-xs btn-outline"
                    >
                      + Añadir Variante
                    </button>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {formData.variants.map((v, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input 
                          type="text" 
                          placeholder="Talla (Ej: S, Único)" 
                          className="input input-bordered input-sm flex-1 bg-base-100" 
                          value={v.talla} 
                          onChange={(e) => {
                            const newVariants = [...formData.variants];
                            newVariants[i].talla = e.target.value;
                            setFormData({...formData, variants: newVariants});
                          }} 
                        />
                        <input 
                          type="number" 
                          placeholder="Stock" 
                          min="0"
                          className="input input-bordered input-sm w-24 bg-base-100" 
                          value={v.stock} 
                          onChange={(e) => {
                            const newVariants = [...formData.variants];
                            newVariants[i].stock = Number(e.target.value);
                            setFormData({...formData, variants: newVariants});
                          }} 
                        />
                        <button 
                          type="button" 
                          onClick={() => {
                            if (formData.variants.length > 1) {
                              const newVariants = [...formData.variants];
                              newVariants.splice(i, 1);
                              setFormData({...formData, variants: newVariants});
                            }
                          }}
                          className="btn btn-xs btn-error btn-square"
                          disabled={formData.variants.length === 1}
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="flex justify-end gap-3 pt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost font-semibold">Cancelar</button>
                  <button type="submit" className="btn btn-primary font-semibold">
                    {editingId ? "Guardar Cambios" : "Crear Producto"}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
