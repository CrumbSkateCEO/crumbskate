import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductContext";
import { categories } from "../data/products";

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "remeras",
    description: "",
    image: "",
    inStock: true,
    sizes: ["S", "M", "L", "XL"]
  });

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const formatPrice = (n) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      name: "",
      price: "",
      category: "remeras",
      description: "",
      image: "",
      inStock: true,
      sizes: ["S", "M", "L", "XL"]
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description || "",
      image: product.image || "",
      inStock: product.inStock,
      sizes: product.sizes || ["S", "M", "L", "XL"]
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
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

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que queres eliminar este producto?")) {
      await deleteProduct(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Panel de Admin</h1>
          <p className="text-base-content/50 font-bold uppercase tracking-widest text-xs mt-1">Gestion de catalogo y stock</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary font-black uppercase tracking-widest rounded-sm shadow-lg shadow-primary/20">
          Nuevo Producto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-base-200 p-6 rounded-2xl border border-neutral/20 shadow-lg">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Total Productos</p>
          <p className="text-4xl font-black">{products.length}</p>
        </div>
        <div className="bg-base-200 p-6 rounded-2xl border border-neutral/20 shadow-lg">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Sin Stock</p>
          <p className="text-4xl font-black text-error">{products.filter(p => !p.inStock).length}</p>
        </div>
        <div className="bg-base-200 p-6 rounded-2xl border border-neutral/20 shadow-lg">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Categorias</p>
          <p className="text-4xl font-black text-primary">{categories.length - 1}</p>
        </div>
      </div>

      <div className="bg-base-200 rounded-3xl border border-neutral/20 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-base-300/50 border-b border-neutral/20">
                <th className="uppercase tracking-widest text-[10px] font-black opacity-50 py-6">Producto</th>
                <th className="uppercase tracking-widest text-[10px] font-black opacity-50">Categoria</th>
                <th className="uppercase tracking-widest text-[10px] font-black opacity-50">Precio</th>
                <th className="uppercase tracking-widest text-[10px] font-black opacity-50 text-center">Stock</th>
                <th className="uppercase tracking-widest text-[10px] font-black opacity-50 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral/5">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-base-300/30 transition-colors group">
                  <td className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-neutral rounded-lg flex items-center justify-center shrink-0 border border-neutral/30 group-hover:scale-110 transition-transform overflow-hidden">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-neutral-content/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21"/>
                          </svg>
                        )}
                      </div>
                      <div className="max-w-[200px]">
                        <p className="font-black uppercase text-sm leading-tight truncate">{product.name}</p>
                        <p className="text-[10px] font-bold opacity-40 uppercase tracking-tighter truncate">{product.description || "Sin descripcion"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="uppercase font-bold text-xs opacity-60 tracking-wider">
                    {product.category}
                  </td>
                  <td className="font-black text-sm">
                    {formatPrice(product.price)}
                  </td>
                  <td className="text-center">
                    <span className={`badge border-0 font-black uppercase text-[9px] tracking-widest ${product.inStock ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral/90 backdrop-blur-md overflow-y-auto">
          <div className="bg-base-200 w-full max-w-2xl rounded-3xl shadow-2xl border border-neutral/20 overflow-hidden my-auto">
            <div className="bg-primary p-6 flex justify-between items-center">
              <h3 className="text-xl font-black text-primary-content uppercase italic tracking-tight">
                {editingId ? "Editar Producto" : "Nuevo Producto"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-ghost btn-circle btn-sm text-primary-content">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="form-control">
                    <label className="label uppercase font-black text-[10px] opacity-40">Nombre del Producto</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="input input-bordered bg-base-100 font-bold border-neutral/40 focus:border-primary" 
                    />
                  </div>
                  <div className="form-control">
                    <label className="label uppercase font-black text-[10px] opacity-40">Precio (ARS)</label>
                    <input 
                      required
                      type="number" 
                      value={formData.price} 
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="input input-bordered bg-base-100 font-bold border-neutral/40 focus:border-primary" 
                    />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="form-control">
                    <label className="label uppercase font-black text-[10px] opacity-40">Categoria</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="select select-bordered bg-base-100 font-bold border-neutral/40 focus:border-primary uppercase text-xs"
                    >
                      {categories.filter(c => c.id !== "todos").map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label uppercase font-black text-[10px] opacity-40">URL de la Imagen</label>
                    <input 
                      type="text" 
                      placeholder="https://ejemplo.com/foto.jpg"
                      value={formData.image} 
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="input input-bordered bg-base-100 font-bold border-neutral/40 focus:border-primary text-xs" 
                    />
                  </div>
               </div>

               <div className="form-control">
                  <label className="label uppercase font-black text-[10px] opacity-40">Descripcion</label>
                  <textarea 
                    rows="3"
                    value={formData.description} 
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="textarea textarea-bordered bg-base-100 font-bold border-neutral/40 focus:border-primary resize-none"
                    placeholder="Contanos mas sobre este producto..."
                  ></textarea>
               </div>

               <div className="flex items-center gap-4 py-2">
                  <input 
                    type="checkbox" 
                    checked={formData.inStock} 
                    onChange={(e) => setFormData({...formData, inStock: e.target.checked})}
                    className="checkbox checkbox-primary rounded-sm" 
                  />
                  <span className="font-bold uppercase text-xs tracking-widest">Disponible para la venta (Stock)</span>
               </div>

               <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn bg-base-300 border-0 flex-1 font-black uppercase rounded-sm">Cancelar</button>
                  <button type="submit" className="btn btn-primary flex-1 font-black uppercase rounded-sm shadow-lg shadow-primary/20">
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

export default Admin;
