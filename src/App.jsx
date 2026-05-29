import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Login from './pages/Login'
import AdminLayout from './pages/AdminLayout'
import AdminDashboard from './pages/AdminDashboard'
import AdminCategories from './pages/AdminCategories'
import AdminProducts from './pages/AdminProducts'
import AdminOrders from './pages/AdminOrders'
import AdminBanners from './pages/AdminBanners'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import CategoryResults from './pages/CategoryResults'
import SearchResults from './pages/SearchResults'
import UserDashboard from './pages/UserDashboard'
import Profile from './pages/Profile'
import AdminCoupons from './pages/AdminCoupons'
import About from './pages/About'
import ContactFAQ from './pages/ContactFAQ'
import Policy from './pages/Policy'

import { CheckCircle, AlertCircle, X } from 'lucide-react';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/" />;
  return children;
};

const GlobalToast = () => {
  const [toast, setToast] = React.useState({ show: false, message: '', type: 'info' });

  React.useEffect(() => {
    window.alert = (message) => {
      let type = 'info';
      const lower = String(message).toLowerCase();
      if (lower.includes('sucesso') || lower.includes('cadastrado') || lower.includes('atualizado') || lower.includes('salvo') || lower.includes('pronto')) {
        type = 'success';
      } else if (lower.includes('erro') || lower.includes('falha') || lower.includes('inválido') || lower.includes('preencha') || lower.includes('obrigatório') || lower.includes('remover') || lower.includes('excluir')) {
        type = 'error';
      }
      
      setToast({ show: true, message, type });
    };

    if (toast.show) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  if (!toast.show) return null;

  const getStyle = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'error':
        return 'bg-rose-50 border-rose-200 text-rose-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] max-w-sm w-full animate-in slide-in-from-bottom-8 duration-300">
      <div className={`p-4 rounded-2xl border shadow-xl backdrop-blur-sm flex gap-3 items-start ${getStyle()}`}>
        <div className="shrink-0 mt-0.5">
          {toast.type === 'success' ? (
            <CheckCircle className="text-emerald-600" size={20} />
          ) : (
            <AlertCircle className="text-rose-600" size={20} />
          )}
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
            {toast.type === 'success' ? 'Sucesso' : toast.type === 'error' ? 'Atenção' : 'Notificação'}
          </p>
          <p className="text-sm font-bold leading-relaxed">{toast.message}</p>
        </div>
        <button 
          onClick={() => setToast(prev => ({ ...prev, show: false }))}
          className="shrink-0 opacity-60 hover:opacity-100 transition-opacity p-0.5 hover:bg-black/5 rounded"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
        <div className="min-h-screen bg-background relative">
          <GlobalToast />
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/admin" element={
              <PrivateRoute adminOnly>
                <AdminLayout />
              </PrivateRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="categorias" element={<AdminCategories />} />
              <Route path="produtos" element={<AdminProducts />} />
              <Route path="pedidos" element={<AdminOrders />} />
              <Route path="banners" element={<AdminBanners />} />
              <Route path="cupons" element={<AdminCoupons />} />
            </Route>

            <Route path="/" element={<Home />} />
            <Route path="/produtos" element={<Products />} />
            <Route path="/produto/:id" element={<ProductDetail />} />
            <Route path="/carrinho" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/categoria/:slug" element={<CategoryResults />} />
            <Route path="/busca" element={<SearchResults />} />
            <Route path="/minha-conta" element={
              <PrivateRoute>
                <UserDashboard />
              </PrivateRoute>
            } />
            <Route path="/perfil" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/sobre" element={<About />} />
            <Route path="/ajuda" element={<ContactFAQ />} />
            <Route path="/contato" element={<ContactFAQ />} />
            <Route path="/politica" element={<Policy />} />
          </Routes>
        </div>
      </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
