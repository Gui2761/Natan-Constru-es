import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart3, 
  Package, 
  Layers, 
  ShoppingCart, 
  LogOut, 
  Image as ImageIcon,
  Ticket
} from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-6 py-4 transition-all ${
      active 
        ? 'bg-primary text-white font-bold border-r-4 border-secondary' 
        : 'text-outline hover:bg-primary/5'
    }`}
  >
    <Icon size={20} />
    <span>{label}</span>
  </Link>
);

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-outline-variant flex flex-col fixed h-full z-20">
        <div className="p-8 border-b border-outline-variant">
          <h2 className="text-xl font-black text-primary uppercase tracking-tighter italic">Natan Admin</h2>
          <p className="text-[10px] text-outline font-bold uppercase tracking-widest mt-1">Gestão de Obras</p>
        </div>

        <nav className="flex-1 mt-6">
          <SidebarItem to="/admin" icon={BarChart3} label="Dashboard" active={location.pathname === '/admin'} />
          <SidebarItem to="/admin/produtos" icon={Package} label="Produtos" active={location.pathname.includes('/produtos')} />
          <SidebarItem to="/admin/categorias" icon={Layers} label="Categorias" active={location.pathname.includes('/categorias')} />
          <SidebarItem to="/admin/pedidos" icon={ShoppingCart} label="Pedidos" active={location.pathname.includes('/pedidos')} />
          <SidebarItem to="/admin/banners" icon={ImageIcon} label="Banners Home" active={location.pathname.includes('/banners')} />
          <SidebarItem to="/admin/cupons" icon={Ticket} label="Cupons" active={location.pathname.includes('/cupons')} />
        </nav>

        <button 
          onClick={handleLogout}
          className="p-6 flex items-center gap-3 text-error hover:bg-error/5 border-t border-outline-variant mt-auto"
        >
          <LogOut size={20} />
          <span className="font-bold">Sair do Painel</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        <header className="h-20 bg-surface/80 backdrop-blur-md border-b border-outline-variant flex items-center justify-between px-10 sticky top-0 z-10">
          <h1 className="text-lg font-bold text-on-surface">Painel de Controle</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold">{user?.name}</p>
              <p className="text-[10px] text-outline uppercase font-bold tracking-widest">Administrador</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {user?.name?.[0]}
            </div>
          </div>
        </header>

        <section className="p-10">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
