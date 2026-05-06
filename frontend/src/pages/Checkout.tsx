import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Checkout = () => {
  const { cartItems, refreshCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (cartItems.length === 0 && !success) {
      navigate("/carrito");
    }
  }, [user, cartItems, navigate, success]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : 450;
  const total = subtotal + (cartItems.length > 0 ? shipping : 0);

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Confirmar pedido (lee del carrito activo en DB)
      await api.post("/pedidos");
      await refreshCart(); // Para vaciar el carrito localmente
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al procesar el pedido.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center space-y-6">
        <div className="w-24 h-24 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tight italic">¡Pedido Confirmado!</h1>
        <p className="text-base-content/70">Tu pedido ha sido procesado exitosamente y esta pendiente de pago.</p>
        <div className="pt-8 flex gap-4 justify-center">
          <Link to="/perfil" className="btn btn-primary font-black uppercase rounded-sm">
            Ver mis pedidos
          </Link>
          <Link to="/" className="btn btn-outline uppercase font-black rounded-sm">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-black uppercase tracking-tighter mb-8 italic">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-base-200 rounded-2xl shadow-lg border border-neutral/20 p-6 md:p-8">
             <h2 className="text-xl font-black uppercase mb-6 border-b border-neutral/20 pb-4">Detalles de Envio y Pago</h2>
             
             {error && (
               <div className="bg-error/10 border border-error p-4 rounded-xl text-error mb-6 font-bold text-sm">
                 {error}
               </div>
             )}

             <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
               {/* Simulacion de form para UI */}
               <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label text-[10px] uppercase font-black opacity-50">Nombre</label>
                    <input required type="text" className="input input-bordered" placeholder="Juan" defaultValue={user?.nombre?.split(' ')[0]} />
                  </div>
                  <div className="form-control">
                    <label className="label text-[10px] uppercase font-black opacity-50">Apellido</label>
                    <input required type="text" className="input input-bordered" placeholder="Perez" defaultValue={user?.nombre?.split(' ')[1] || ''} />
                  </div>
               </div>
               <div className="form-control">
                  <label className="label text-[10px] uppercase font-black opacity-50">Direccion de Envio</label>
                  <input required type="text" className="input input-bordered" placeholder="Av. Siempre Viva 123" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label text-[10px] uppercase font-black opacity-50">Ciudad</label>
                    <input required type="text" className="input input-bordered" placeholder="CABA" />
                  </div>
                  <div className="form-control">
                    <label className="label text-[10px] uppercase font-black opacity-50">Codigo Postal</label>
                    <input required type="text" className="input input-bordered" placeholder="1000" />
                  </div>
               </div>
             </form>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-base-200 rounded-2xl shadow-xl border border-neutral/20 overflow-hidden sticky top-24">
            <div className="p-6 border-b border-neutral/20 bg-primary/5">
              <h2 className="text-xl font-black uppercase tracking-tighter">Resumen</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-3 max-h-48 overflow-y-auto mb-4 border-b border-neutral/10 pb-4">
                 {cartItems.map(item => (
                   <div key={`${item.id}-${item.selectedSize}`} className="flex justify-between items-center text-sm">
                     <span className="truncate pr-4 flex-1">{item.quantity}x {item.name}</span>
                     <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                   </div>
                 ))}
              </div>

              <div className="flex justify-between text-sm">
                <span className="font-bold text-base-content/60">Subtotal</span>
                <span className="font-black">{formatPrice(subtotal)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="font-bold text-base-content/60">Envio</span>
                <span className={`font-black ${shipping === 0 ? 'text-success' : ''}`}>
                  {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
                </span>
              </div>
              
              <div className="divider opacity-10 my-0"></div>
              
              <div className="flex justify-between items-end pt-2">
                <span className="text-lg font-black uppercase tracking-widest">Total</span>
                <span className="text-3xl font-black text-primary leading-none mb-1">{formatPrice(total)}</span>
              </div>
              
              <button 
                form="checkout-form"
                type="submit" 
                disabled={loading}
                className="btn btn-primary w-full mt-4 font-black uppercase tracking-widest rounded-sm shadow-lg"
              >
                {loading ? <span className="loading loading-spinner"></span> : "Confirmar Pedido"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
