import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, Button } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { ShoppingBag, ChevronRight, Package, Truck, CheckCircle2, MapPin, User as UserIcon, XCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get(`/orders/user/${user.id}`);
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'PROCESSANDO': return <Package className="text-blue-500" />;
      case 'SAIU_ENTREGA': return <Truck className="text-orange-500" />;
      case 'ENTREGUE': return <CheckCircle2 className="text-green-500" />;
      case 'CANCELADO': return <XCircle className="text-red-500" />;
      default: return <Package />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto py-10 px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Sidebar de Perfil */}
          <div className="space-y-6">
            <Card className="text-center py-10 border-b-8 border-b-secondary">
               <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center mx-auto text-4xl font-black mb-4 italic">
                  {user?.name?.[0]}
               </div>
               <h3 className="text-xl font-bold text-primary truncate">{user?.name}</h3>
               <p className="text-xs text-outline uppercase font-black tracking-widest mt-1">Cliente Natan</p>
               
               <div className="mt-8 space-y-2 text-left">
                  <Link to="/perfil" className="flex items-center justify-between p-4 bg-surface-container rounded-xl hover:bg-primary/5 transition-colors group">
                    <div className="flex items-center gap-3">
                       <UserIcon size={18} className="text-primary" />
                       <span className="text-sm font-bold">Meus Dados</span>
                    </div>
                    <ChevronRight size={16} className="text-outline group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/carrinho" className="flex items-center justify-between p-4 bg-surface-container rounded-xl hover:bg-primary/5 transition-colors group">
                    <div className="flex items-center gap-3">
                       <ShoppingBag size={18} className="text-primary" />
                       <span className="text-sm font-bold">Ver Carrinho</span>
                    </div>
                    <ChevronRight size={16} className="text-outline group-hover:translate-x-1 transition-transform" />
                  </Link>
               </div>

               <Button variant="ghost" className="w-full mt-10 text-error hover:bg-error/5" onClick={() => { logout(); navigate('/'); }}>
                 Sair da Conta
               </Button>
            </Card>

            <Card className="bg-primary text-white space-y-4">
               <div className="flex items-center gap-2 mb-2">
                 <MapPin className="text-secondary" />
                 <h4 className="font-black uppercase italic tracking-tighter">Endereço de Obra</h4>
               </div>
               <p className="text-sm text-white/70 leading-relaxed font-bold">
                 {user?.address?.street}, {user?.address?.number}<br />
                 {user?.address?.city} - {user?.address?.state}<br />
                 CEP: {user?.address?.zipCode}
               </p>
            </Card>
          </div>

          {/* Histórico de Pedidos */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex items-center justify-between border-b border-outline-variant pb-6">
               <h2 className="text-3xl font-black text-primary uppercase italic tracking-tighter">Meus Pedidos</h2>
               <span className="text-xs font-black uppercase tracking-[0.2em] bg-surface-container px-4 py-2 rounded-full border border-outline-variant">
                 Total: {orders.length}
               </span>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-20 bg-surface-container/30 rounded-3xl border-2 border-dashed border-outline-variant">
                 <p className="text-outline italic">Você ainda não realizou nenhum pedido.</p>
                 <Button className="mt-6" onClick={() => navigate('/')}>Ir para a Loia</Button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map(order => (
                  <Card key={order.id} className="group hover:border-primary transition-all overflow-hidden border-l-8 border-l-secondary">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                       <div className="space-y-4">
                          <div className="flex items-center gap-4">
                             <span className="text-xl font-black text-primary uppercase italic">#{order.id}</span>
                             <div className="flex items-center gap-2 px-3 py-1 bg-surface-container/50 rounded-full border border-outline-variant">
                                {getStatusIcon(order.status)}
                                <span className="text-[10px] font-black uppercase text-on-surface tracking-widest">{order.status.replace('_', ' ')}</span>
                             </div>
                          </div>
                          <p className="text-xs text-outline font-bold uppercase tracking-widest">
                            Realizado em: {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                       </div>

                       <div className="flex flex-col items-end gap-3">
                          <span className="text-3xl font-black text-primary tracking-tighter">R$ {order.totalAmount.toFixed(2)}</span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className={`font-bold border-primary/10 uppercase text-[10px] tracking-widest transition-all ${expandedOrder === order.id ? 'bg-primary text-white border-primary' : ''}`}
                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                          >
                            {expandedOrder === order.id ? 'Fechar Detalhes' : 'Ver Itens'}
                          </Button>
                       </div>
                    </div>

                    {/* Lista Expandida de Itens */}
                    {expandedOrder === order.id && (
                      <div className="mt-8 pt-6 border-t border-outline-variant animate-in slide-in-from-top-4 duration-300">
                         <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-4">Itens do Pedido</p>
                         <div className="space-y-3">
                            {JSON.parse(order.items).map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 bg-surface-container/30 rounded-xl">
                                <div className="flex items-center gap-3">
                                   <div className="w-10 h-10 bg-white rounded-lg border border-outline-variant flex items-center justify-center font-bold text-primary text-xs italic">
                                      {idx + 1}
                                   </div>
                                   <div>
                                      <p className="font-bold text-sm text-primary">{item.name}</p>
                                      <p className="text-[10px] text-outline uppercase font-black">{item.quantity} unidades x R$ {item.finalPrice.toFixed(2)}</p>
                                   </div>
                                </div>
                                <span className="font-bold text-primary text-sm">R$ {(item.finalPrice * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                         </div>
                      </div>
                    )}

                  </Card>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
