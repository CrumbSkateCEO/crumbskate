import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductDetail from "./pages/ProductDetail";
import Registro from "./pages/Registro";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import OrderDetail from "./pages/OrderDetail";

import AdminLayout from "./layout/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminCategories from "./pages/admin/Categories";
import AdminStock from "./pages/admin/Stock";
import AdminCoupons from "./pages/admin/Coupons";
import AdminUsers from "./pages/admin/Users";
import AdminSettings from "./pages/admin/Settings";
import AdminReviews from "./pages/admin/Reviews";
import AdminReports from "./pages/admin/Reports";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import { ConfigProvider } from "./context/ConfigContext";

function App() {
  return (
    <ConfigProvider>
      <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <Routes>
            {/* Rutas de la Tienda (Públicas) */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/producto/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/carrito" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/perfil" element={<Profile />} />
              <Route path="/pedido/:id" element={<OrderDetail />} />
            </Route>

            {/* Rutas de Administración (Protegidas) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="productos" element={<AdminProducts />} />
              <Route path="categorias" element={<AdminCategories />} />
              <Route path="pedidos" element={<AdminOrders />} />
              <Route path="cupones" element={<AdminCoupons />} />
              <Route path="stock" element={<AdminStock />} />
              <Route path="reportes" element={<AdminReports />} />
              <Route path="resenas" element={<AdminReviews />} />
              <Route path="configuracion" element={<AdminSettings />} />
              <Route path="usuarios" element={<AdminUsers />} />
            </Route>
          </Routes>
        </CartProvider>
      </ProductProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
