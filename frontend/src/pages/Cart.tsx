import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cartItems, updateQuantity, removeItem } = useCart();
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [activeDiscount, setActiveDiscount] = useState(0); // 1 = 100% discount
  const [couponError, setCouponError] = useState("");

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = subtotal * activeDiscount;
  const subtotalWithDiscount = subtotal - discountAmount;
  const shipping = subtotalWithDiscount > 5000 || activeDiscount === 1 ? 0 : 450;
  const total = subtotalWithDiscount + (cartItems.length > 0 ? shipping : 0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "CHIMICHANGA") {
      setActiveDiscount(1);
      setCouponError("");
      setIsCouponModalOpen(false);
    } else {
      setCouponError("Cupon invalido");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="bg-base-200 p-12 rounded-3xl shadow-xl flex flex-col items-center">
          <div className="bg-base-300 w-24 h-24 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Tu carrito esta vacio</h1>
          <p className="text-base-content/60 mb-8 max-w-sm">¿Todavia no sabes que comprar? ¡Mira nuestros ultimos lanzamientos!</p>
          <Link to="/" className="btn btn-primary btn-wide font-black uppercase rounded-sm">
            Ir a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 md:py-12 px-4 relative">
      <h1 className="text-3xl font-black uppercase tracking-tighter mb-8 italic">Carrito</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* List of items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-base-200 rounded-2xl shadow-lg border border-neutral/20 overflow-hidden">
            <div className="p-4 md:p-6 bg-base-300/30 border-b border-neutral/20 flex justify-between items-center">
              <span className="font-bold uppercase tracking-widest text-xs opacity-60">Productos</span>
              <span className="font-bold uppercase tracking-widest text-xs opacity-60 hidden md:block">Subtotal</span>
            </div>
            
            <div className="divide-y divide-neutral/10">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.selectedSize}`} className="p-4 md:p-6 flex flex-col md:flex-row gap-6 items-center md:items-start transition-colors hover:bg-base-300/10">
                  <div className="w-24 h-24 bg-neutral rounded-xl overflow-hidden shrink-0 border border-neutral/20 shadow-inner flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-neutral-content/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                        <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21"/>
                    </svg>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <Link to={`/producto/${item.id}`} className="text-lg font-black hover:text-primary transition-colors uppercase leading-tight">
                      {item.name}
                    </Link>
                    <p className="text-sm text-base-content/50 font-bold uppercase tracking-widest mt-1">
                      Crumbskate {item.selectedSize ? `| Talle ${item.selectedSize}` : ''}
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                      <button onClick={() => removeItem(item.id)} className="text-xs font-bold text-error uppercase hover:underline">Eliminar</button>
                      <button className="text-xs font-bold text-primary uppercase hover:underline">Guardar para despues</button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto">
                    <div className="flex items-center border border-neutral/30 rounded-lg bg-base-100 overflow-hidden shadow-sm">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-3 py-1 hover:bg-neutral hover:text-neutral-content transition-colors font-bold border-r border-neutral/30"
                      >-</button>
                      <span className="px-4 py-1 font-black min-w-[40px] text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-3 py-1 hover:bg-neutral hover:text-neutral-content transition-colors font-bold border-l border-neutral/30"
                      >+</button>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-black ${activeDiscount === 1 ? 'line-through opacity-30 text-xs' : ''}`}>{formatPrice(item.price * item.quantity)}</p>
                      {activeDiscount === 1 && <p className="text-xl font-black text-success">Gratis</p>}
                      {item.quantity > 1 && activeDiscount !== 1 && (
                        <p className="text-xs text-base-content/40 font-bold">{formatPrice(item.price)} c/u</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-base-300/10 flex justify-end">
              <Link to="/" className="text-xs font-black uppercase text-primary hover:underline">
                Continuar comprando
              </Link>
            </div>
          </div>
        </div>
        
        {/* Summary Sidebar */}
        <div className="space-y-4">
          <div className="bg-base-200 rounded-2xl shadow-xl border border-neutral/20 overflow-hidden sticky top-24">
            <div className="p-6 border-b border-neutral/20 bg-primary/5">
              <h2 className="text-xl font-black uppercase tracking-tighter">Resumen de compra</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="font-bold text-base-content/60">Productos ({cartItems.reduce((a,b) => a+b.quantity, 0)})</span>
                <span className="font-black">{formatPrice(subtotal)}</span>
              </div>
              
              {activeDiscount > 0 && (
                <div className="flex justify-between text-sm text-success font-black">
                  <span className="uppercase tracking-widest text-[10px]">Descuento Cupon</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="font-bold text-base-content/60">Envio</span>
                <span className={`font-black ${shipping === 0 ? 'text-success' : ''}`}>
                  {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
                </span>
              </div>
              
              {shipping > 0 && activeDiscount !== 1 && (
                <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                  <p className="text-[10px] font-black uppercase text-primary leading-tight">
                    Agrega {formatPrice(5000 - subtotalWithDiscount)} mas para envio gratis
                  </p>
                </div>
              )}
              
              <div className="divider opacity-10 my-0"></div>
              
              <div className="flex justify-between items-end pt-2">
                <span className="text-lg font-black uppercase tracking-widest">Total</span>
                <div className="text-right">
                  <p className="text-3xl font-black text-primary dark:text-[#ff6b6b] leading-none mb-1">{formatPrice(total)}</p>
                  <p className="text-[10px] text-base-content/40 font-bold uppercase tracking-widest">IVA incluido</p>
                </div>
              </div>
              
              <Link to="/checkout" className="btn btn-primary w-full mt-4 font-black uppercase tracking-widest rounded-sm text-sm shadow-lg hover:shadow-primary/20 hover:scale-[1.02] transition-all">
                Continuar compra
              </Link>
            </div>
          </div>
          
          {/* Coupon / Benefits */}
          <div 
            onClick={() => setIsCouponModalOpen(true)}
            className={`bg-base-200 rounded-2xl shadow-md border p-4 flex items-center gap-4 group cursor-pointer transition-colors ${activeDiscount === 1 ? 'border-success bg-success/5' : 'border-neutral/20 hover:border-primary/40'}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${activeDiscount === 1 ? 'bg-success/20 text-success' : 'bg-primary/10 text-primary'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 11-1-1v1h1z" clipRule="evenodd" />
                <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest">
                {activeDiscount === 1 ? 'Cupon aplicado: CHIMICHANGA' : '¿Tenes un cupon?'}
              </p>
              <p className="text-[10px] font-bold text-base-content/40 uppercase">
                {activeDiscount === 1 ? '¡Disfruta tu regalo!' : 'Ingresalo haciendo click aqui'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-base-200 w-full max-w-sm rounded-3xl shadow-2xl border border-neutral/20 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-primary p-6 flex justify-between items-center">
              <h3 className="text-xl font-black text-primary-content uppercase tracking-tight italic">Ingresar Cupon</h3>
              <button onClick={() => setIsCouponModalOpen(false)} className="btn btn-ghost btn-circle btn-sm text-primary-content hover:bg-primary-focus">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleApplyCoupon} className="p-8 space-y-6">
              <div className="form-control">
                <label className="label py-0 mb-2">
                  <span className="label-text text-[10px] font-black uppercase tracking-widest opacity-50">Codigo del cupon</span>
                </label>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Ej: CHIMICHANGA" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className={`input input-bordered w-full bg-base-100 font-black uppercase placeholder:opacity-30 ${couponError ? 'border-error text-error' : 'border-neutral/40'}`}
                />
                {couponError && <p className="text-[10px] font-bold text-error uppercase mt-2">{couponError}</p>}
              </div>

              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="btn bg-base-300 hover:bg-neutral hover:text-neutral-content border-0 flex-1 font-black uppercase text-xs rounded-sm"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary flex-1 font-black uppercase text-xs rounded-sm shadow-lg shadow-primary/20"
                >
                  Aplicar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
