import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, ChevronDown, LogOut, UserPlus } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

import api from '../services/api';

export default function Header() {
  const [categories, setCategories] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [activeOrders, setActiveOrders] = useState([]);
  const [dismissedNotifs, setDismissedNotifs] = useState(() => {
    try {
      const saved = localStorage.getItem('dismissed_order_notifs');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (user && !isAdmin) {
      fetchUserOrders();
    } else {
      setActiveOrders([]);
    }
  }, [user]);

  const fetchUserOrders = async () => {
    try {
      const { data } = await api.get(`/orders/user/${user.id}`);
      setActiveOrders(data.slice(0, 3)); // Pega os 3 pedidos mais recentes
    } catch (err) {
      console.error(err);
    }
  };

  const handleDismissNotif = (orderId, status) => {
    const key = `${orderId}_${status}`;
    const nextDismissed = [...dismissedNotifs, key];
    setDismissedNotifs(nextDismissed);
    localStorage.setItem('dismissed_order_notifs', JSON.stringify(nextDismissed));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Lógica de Overflow: Mostra as 5 primeiras, o resto vai no "Mais"
  const mainCategories = categories.slice(0, 5);
  const extraCategories = categories.slice(5);

  return (
    <header className="bg-surface border-b border-outline-variant sticky top-0 z-50">
      {/* Top Bar - Info & Social */}
      <div className="bg-primary text-white text-[10px] py-2 px-10 flex justify-between uppercase font-bold tracking-widest">
        <span>Atendimento: (79) 99674-1307</span>
        <span>Entregas rápidas para toda a região</span>
      </div>

      <div className="max-w-7xl mx-auto py-4 flex items-center justify-between gap-8">
        {/* LOGO */}
        <Link to="/" className="flex-shrink-0">
          <img src="/logo_horizontal.png" alt="Natan Construções" className="h-24 w-auto object-contain" />
        </Link>

        {/* BUSCA */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 relative max-w-xl">
          <input 
            type="text" 
            placeholder="O que você precisa para sua obra hoje?" 
            className="w-full pl-6 pr-12 py-3 bg-surface-container border border-outline-variant rounded-full text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:scale-110 transition-transform">
            <Search size={20} />
          </button>
        </form>

        {/* ACÕES */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            {user ? (
               <div className="flex items-center gap-4">
                  <Link to="/minha-conta" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-full border-2 border-primary/20 overflow-hidden bg-surface-container group-hover:border-primary transition-colors">
                       {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                       ) : (
                          <div className="w-full h-full flex items-center justify-center text-primary font-bold text-sm">
                             {user.name.charAt(0)}
                          </div>
                       )}
                    </div>
                    <span className="hidden md:block text-xs font-black uppercase text-primary italic group-hover:underline">Minha Conta</span>
                  </Link>
                  <button 
                    onClick={() => { logout(); navigate('/login'); }}
                    className="p-2 text-outline hover:text-secondary transition-colors bg-surface-container rounded-full border border-outline-variant"
                    title="Trocar de Conta"
                  >
                    <UserPlus size={18} />
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-outline hover:text-error transition-colors bg-surface-container rounded-full border border-outline-variant"
                    title="Sair da Conta"
                  >
                    <LogOut size={18} />
                  </button>
               </div>
            ) : (
               <Link to="/login" className="flex items-center gap-2 group">
                  <div className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                    <User size={20} className="text-primary" />
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-[10px] text-outline font-bold uppercase tracking-widest">Minha Conta</p>
                    <p className="text-xs font-bold text-primary">Entrar/Criar</p>
                  </div>
               </Link>
            )}
          </div>

          <Link to="/carrinho" className="relative group">
            <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center shadow-blueprint hover:scale-105 transition-transform">
              <ShoppingCart size={20} />
            </div>
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-black">
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </span>

          </Link>
          
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Barra de Notificações de Pedidos Ativos */}
      {user && !isAdmin && activeOrders.filter(order => !dismissedNotifs.includes(`${order.id}_${order.status}`)).length > 0 && (
        <div className="bg-surface-container border-t border-b border-outline-variant/30 px-6 py-2">
          <div className="max-w-7xl mx-auto flex flex-wrap gap-4 items-center text-[11px] font-bold text-primary">
            {activeOrders.filter(order => !dismissedNotifs.includes(`${order.id}_${order.status}`)).map(order => {
              let text = '';
              let badgeStyle = '';
              
              switch(order.status) {
                case 'PROCESSANDO': 
                  text = `Seu pedido #${order.id} esta sendo preparado em nosso estoque.`;
                  badgeStyle = 'bg-blue-100 text-blue-700';
                  break;
                case 'SAIU_ENTREGA': 
                  text = `Excelente! Seu pedido #${order.id} saiu para entrega e esta a caminho!`;
                  badgeStyle = 'bg-orange-100 text-orange-700 animate-pulse border border-orange-200';
                  break;
                case 'ENTREGUE': 
                  text = `Seu pedido #${order.id} foi entregue com sucesso!`;
                  badgeStyle = 'bg-green-100 text-green-700';
                  break;
                case 'PENDENTE_CANCELAMENTO': 
                  text = `A solicitacao de cancelamento do seu pedido #${order.id} esta em analise.`;
                  badgeStyle = 'bg-yellow-100 text-yellow-700';
                  break;
                case 'CANCELADO': 
                  text = `Seu pedido #${order.id} foi cancelado comercialmente.`;
                  badgeStyle = 'bg-red-100 text-red-700';
                  break;
                default: 
                  return null;
              }
              
              return (
                <div key={order.id} className="flex items-center gap-2 border-r last:border-0 border-outline-variant/20 pr-4 shrink-0">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${badgeStyle}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                  <span>{text}</span>
                  <Link to="/minha-conta" className="text-secondary hover:underline ml-1" onClick={() => handleDismissNotif(order.id, order.status)}>Acompanhar</Link>
                  <button 
                    onClick={() => handleDismissNotif(order.id, order.status)}
                    className="ml-1 text-outline hover:text-error transition-colors p-0.5 rounded-full hover:bg-outline-variant/25"
                    title="Dispensar notificação"
                  >
                    <X size={10} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Navegação de Categorias - Dinâmica */}
      <nav className="hidden md:block border-t border-outline-variant/30">
        <div className="max-w-7xl mx-auto flex items-center gap-8 py-3">
          <Link to="/produtos" className="text-xs font-black uppercase text-secondary hover:text-primary transition-colors flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
            Todas as Ofertas
          </Link>

          {mainCategories.map(cat => (
            <Link 
              key={cat.id} 
              to={`/categoria/${cat.slug}`} 
              className="text-xs font-bold uppercase text-on-surface hover:text-primary transition-colors hover:underline decoration-secondary decoration-2 underline-offset-4"
            >
              {cat.name}
            </Link>
          ))}

          {extraCategories.length > 0 && (
            <div className="relative group">
              <button className="text-xs font-bold uppercase text-on-surface hover:text-primary flex items-center gap-1">
                Mais Departamentos <ChevronDown size={14} />
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-xl border border-outline-variant rounded-xl hidden group-hover:block transition-all animate-in fade-in slide-in-from-top-2">
                {extraCategories.map(cat => (
                  <Link 
                    key={cat.id}
                    to={`/categoria/${cat.slug}`}
                    className="block px-6 py-3 text-xs font-bold uppercase text-on-surface hover:bg-primary/5 hover:text-primary border-b last:border-0 border-outline-variant/20"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {isAdmin && (
            <Link to="/admin" className="ml-auto text-xs font-black uppercase text-primary border-2 border-primary/20 px-4 py-1.5 rounded-full hover:bg-primary hover:text-white transition-all">
              Painel Admin
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-outline-variant p-6 space-y-4 animate-in slide-in-from-left-full">
           <div className="space-y-4">
              <p className="text-[10px] font-black text-outline uppercase tracking-widest">Categorias</p>
              {categories.map(cat => (
                <Link key={cat.id} to={`/categoria/${cat.slug}`} className="block text-lg font-bold text-primary">{cat.name}</Link>
              ))}
           </div>
        </div>
      )}
    </header>
  );
}
