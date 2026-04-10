import React, { useState, useEffect } from 'react';
import { Card } from '../components/UI';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Wallet,
  AlertTriangle,
  Package,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color, loading }) => (
  <Card className="flex items-center gap-6">
    <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-${color.replace('bg-', '')}`}>
      <Icon size={32} />
    </div>
    <div>
      <p className="text-sm font-medium text-outline">{title}</p>
      <h3 className="text-2xl font-black">{loading ? '...' : value}</h3>
    </div>
  </Card>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    pendingOrders: 0,
    totalProducts: 0,
    lowStockItems: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [ordersRes, productsRes] = await Promise.all([
        api.get('/orders'),
        api.get('/products')
      ]);

      const orders = ordersRes.data;
      const products = productsRes.data;

      const totalSales = orders.reduce((acc, current) => acc + current.totalAmount, 0);
      const pendingOrders = orders.filter(o => o.status === 'PROCESSANDO').length;
      const lowStockItems = products.filter(p => p.stock <= 5);

      setStats({
        totalSales,
        pendingOrders,
        totalProducts: products.length,
        lowStockItems
      });
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Vendas Totais" 
          value={`R$ ${stats.totalSales.toFixed(2)}`} 
          icon={Wallet} 
          color="bg-green-600" 
          loading={loading}
        />
        <StatCard 
          title="Pedidos Pendentes" 
          value={stats.pendingOrders} 
          icon={ShoppingBag} 
          color="bg-primary" 
          loading={loading}
        />
        <StatCard 
          title="Produtos Ativos" 
          value={stats.totalProducts} 
          icon={Package} 
          color="bg-blue-600" 
          loading={loading}
        />
        <StatCard 
          title="Alertas de Estoque" 
          value={stats.lowStockItems.length} 
          icon={AlertTriangle} 
          color={stats.lowStockItems.length > 0 ? "bg-red-500" : "bg-secondary"} 
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Alertas de Reestoque */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-black uppercase tracking-tighter italic flex items-center gap-2">
              <AlertTriangle size={20} className="text-red-500" /> Alertas de Reestoque
            </h4>
            <span className="text-[10px] font-black bg-red-100 text-red-600 px-3 py-1 rounded-full uppercase tracking-widest">Atenção</span>
          </div>
          
          <div className="space-y-3">
            {stats.lowStockItems.length === 0 ? (
              <p className="text-sm text-outline italic py-10 text-center">Tudo certo! Nenhum produto com estoque crítico.</p>
            ) : (
              stats.lowStockItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-surface-container rounded-2xl border border-outline-variant hover:border-red-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                      <img src={item.images?.split(',')[0]} className="w-full h-full object-cover" alt={item.name} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-primary">{item.name}</p>
                      <p className="text-[10px] text-red-600 font-black uppercase">Restam apenas {item.stock} unidades</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate('/admin/produtos')}
                    className="p-2 text-outline hover:text-primary transition-colors"
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Info Rápida */}
        <Card className="bg-primary text-white border-none shadow-blueprint overflow-hidden relative">
          <div className="relative z-10">
            <h4 className="text-lg font-black uppercase tracking-tighter italic mb-4">Dica do Master Skill</h4>
            <p className="text-sm opacity-90 leading-relaxed font-medium">
              Manter o estoque atualizado é vital para evitar cancelamentos. 
              {stats.lowStockItems.length > 0 ? ` Você tem ${stats.lowStockItems.length} itens que precisam de atenção imediata.` : ' Seu inventário está saudável hoje!'}
            </p>
            <button 
              onClick={() => navigate('/admin/pedidos')}
              className="mt-8 flex items-center gap-2 font-black uppercase text-xs tracking-widest bg-white text-primary px-6 py-3 rounded-xl hover:scale-105 transition-transform"
            >
              Verificar Pedidos <ArrowRight size={16} />
            </button>
          </div>
          <ShoppingBag className="absolute -bottom-8 -right-8 w-48 h-48 opacity-10" />
        </Card>
      </div>
    </div>
  );
}
