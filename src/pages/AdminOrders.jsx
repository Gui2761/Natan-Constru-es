import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../components/UI';
import api from '../services/api';
import { ShoppingCart, Search, Calendar, PackageCheck, Truck, CheckCircle2, XCircle, Info } from 'lucide-react';


export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);


  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data } = await api.get('/orders');
    setOrders(data);
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      fetchOrders();
    } catch (err) {
      alert('Erro ao atualizar status');
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toString().includes(searchTerm) || o.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = dateFilter ? o.createdAt.startsWith(dateFilter) : true;
    return matchesSearch && matchesDate;
  });

  const getStatusStyle = (status) => {
    switch(status) {
      case 'PROCESSANDO': return 'bg-blue-100 text-blue-700';
      case 'SAIU_ENTREGA': return 'bg-orange-100 text-orange-700';
      case 'ENTREGUE': return 'bg-green-100 text-green-700';
      case 'CANCELADO': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';

    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-primary flex items-center gap-2">
           <ShoppingCart /> Gestão de Pedidos
        </h2>
        <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl flex items-center gap-3">
           <Info className="text-blue-500" size={20} />
           <p className="text-[10px] font-bold text-blue-800 uppercase leading-tight">
             Para estornos financeiros, acesse seu painel <br /> comercial do <strong>Mercado Pago</strong>.
           </p>
        </div>
      </div>


      {/* Busca Histórica e Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
          <input 
            type="text" 
            placeholder="Pesquisar por ID ou Nome do Cliente..." 
            className="w-full pl-12 pr-4 py-3 bg-surface border border-outline-variant rounded-2xl outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
          <input 
            type="date" 
            className="w-full pl-12 pr-4 py-3 bg-surface border border-outline-variant rounded-2xl outline-none"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <p className="text-outline italic">Nenhum pedido encontrado no período.</p>
        ) : (
          filteredOrders.map(order => (
            <Card key={order.id} className={`border-l-8 border-l-primary transition-all ${expandedOrder === order.id ? 'shadow-2xl' : ''}`}>
              <div 
                className="cursor-pointer"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black text-primary uppercase">Pedido #{order.id}</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-on-surface">Cliente: {order.user.name}</p>
                  <p className="text-xs text-outline">
                    Endereço: {order.user.address?.street}, {order.user.address?.number} - {order.user.address?.city}/{order.user.address?.state}
                  </p>
                  <p className="text-[10px] text-outline font-medium uppercase mt-2 italic">Data: {new Date(order.createdAt).toLocaleString()}</p>
                </div>

                <div className="flex flex-col items-end gap-4 min-w-[200px]">
                  <span className="text-2xl font-black text-secondary">R$ {order.totalAmount.toFixed(2)}</span>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      title="Processar" 
                      onClick={() => handleUpdateStatus(order.id, 'PROCESSANDO')}
                      className={order.status === 'PROCESSANDO' ? 'bg-primary/10' : ''}
                    >
                      <PackageCheck size={16} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      title="Saiu para Entrega"
                      onClick={() => handleUpdateStatus(order.id, 'SAIU_ENTREGA')}
                      className={order.status === 'SAIU_ENTREGA' ? 'bg-primary/10' : ''}
                    >
                      <Truck size={16} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      title="Entregue"
                      onClick={() => handleUpdateStatus(order.id, 'ENTREGUE')}
                      className={order.status === 'ENTREGUE' ? 'bg-primary/10' : ''}
                    >
                      <CheckCircle2 size={16} />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      title="Cancelar Pedido"
                      onClick={() => {
                        if(window.confirm('Deseja realmente CANCELAR este pedido? Esta ação é irreversível no sistema.')) {
                           handleUpdateStatus(order.id, 'CANCELADO');
                        }
                      }}
                      className={`border-red-200 text-red-500 hover:bg-red-50 ${order.status === 'CANCELADO' ? 'bg-red-100 border-red-500' : ''}`}
                    >
                      <XCircle size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {expandedOrder === order.id && (
                <div className="mt-8 pt-6 border-t border-outline-variant animate-in slide-in-from-top-4 duration-300">
                   <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-4">Itens para Separação</p>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {JSON.parse(order.items).map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-surface-container rounded-xl border border-outline-variant/50">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center font-black italic">
                                {item.quantity}
                             </div>
                             <div>
                                <p className="font-bold text-sm text-primary">{item.name}</p>
                                <p className="text-[10px] text-outline font-black uppercase tracking-widest">Preço Un: R$ {item.finalPrice.toFixed(2)}</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-xs font-black text-secondary">SUBTOTAL</p>
                             <p className="font-bold text-primary">R$ {(item.finalPrice * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
