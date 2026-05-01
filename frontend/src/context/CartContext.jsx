import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }
    try {
      const { data } = await api.get("/carrito");
      // Mapear backend a frontend
      // Backend: id, cantidad, talla, color, precio_extra, nombre, precio_base, imagen_url
      const mapped = data.items.map(item => ({
        id: item.id, // ID del item en el carrito
        variante_id: item.variante_id,
        name: item.nombre,
        price: Number(item.precio_base) + Number(item.precio_extra || 0),
        quantity: item.cantidad,
        size: item.talla,
        image: item.imagen_url
      }));
      setCartItems(mapped);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (product) => {
    if (!user) {
      console.warn("Debe iniciar sesion para agregar al carrito");
      return;
    }
    try {
      // Nota: asumiendo variante_id = product.id por defecto si no hay manejo real de variantes aun
      const varianteId = product.variante_id || product.id; 
      await api.post("/carrito/agregar", {
        variante_id: varianteId,
        cantidad: 1
      });
      fetchCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const updateQuantity = async (id, delta) => {
    // Si la cantidad es <= 0 la removemos
    const item = cartItems.find(i => i.id === id);
    if (!item) return;

    const newQuantity = item.quantity + delta;
    if (newQuantity <= 0) {
      await removeItem(id);
      return;
    }

    try {
      // El endpoint /agregar sirve tambien para incrementar, pero para disminuir no hay un endpoint exacto
      // Vamos a asumir que si delta > 0 usamos agregar, sino fallara por ahora a menos que haya endpoint de update
      if (delta > 0) {
        await api.post("/carrito/agregar", {
          variante_id: item.variante_id || item.id,
          cantidad: delta
        });
      } else {
         console.warn("Backend no soporta disminuir cantidad directamente aun, deberia actualizarse via DB");
      }
      fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (id) => {
    try {
      await api.delete(`/carrito/item/${id}`);
      fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/carrito/vaciar");
      fetchCart();
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeItem, clearCart, refreshCart: fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
