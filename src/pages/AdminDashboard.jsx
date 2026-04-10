import React, { useState, useEffect } from 'react';
import { Card, Button } from '../components/UI';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Wallet,
  AlertTriangle,
  Package,
  ArrowRight,
  TrendingDown,
  DollarSign
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, Cell, PieChart, Pie
} from 'recharts';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color, trend, loading }) => (
  <Card className="flex flex-col gap-4 overflow-hidden relative">
    <div className="flex items-center justify-between">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-${color.replace('bg-', '')}`}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <div>
      <p className="text-xs font-black uppercase tracking-widest text-outline mb-1">{title}</p>
      <h3 className="text-3xl font-black text-primary tracking-tighter">
        {loading ? <span className="animate-pulse">...</span> : value}
      </h3>
    </div>
    {/* Subtle Background Icon */}
    <Icon className="absolute -right-4 -bottom-4 opacity-5 text-primary" size={100} />
  </Card>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    monthlySales: 0,
    dailySales: 0,
    totalProfit: 0,
    pendingOrders: 0,
    totalProducts: 0,
    avgTicket: 0,
    lowStockItems: [],
    chartData: [],
    monthlyData: []
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

      // 1. Cálculos de Vendas
      const today = new Date().toISOString().split('T')[0];
      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();

      const totalSales = orders.reduce((acc, current) => acc + current.totalAmount, 0);
      const dailySales = orders
        .filter(o => o.createdAt.startsWith(today))
        .reduce((acc, current) => acc + current.totalAmount, 0);
      const monthlySales = orders
        .filter(o => {
          const d = new Date(o.createdAt);
          return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
        })
        .reduce((acc, current) => acc + current.totalAmount, 0);

      const pendingOrders = orders.filter(o => o.status === 'PROCESSANDO').length;
      const lowStockItems = products.filter(p => p.stock <= 5);
      const avgTicket = orders.length > 0 ? totalSales / orders.length : 0;

      // 2. Lucro Estimado (Considerando costPrice)
      // Nota: Para pedidos antigos sem costPrice salvo no JSON do item, estimamos 70% de margem
      let totalProfit = 0;
      orders.forEach(order => {
        let orderCost = 0;
        try {
           const items = JSON.parse(order.items);
           items.forEach(item => {
              // Busca o costPrice atual do produto como fallback
              const product = products.find(p => p.id === item.id);
              const cost = product?.costPrice || (item.finalPrice * 0.7); 
              orderCost += (cost * item.quantity);
           });
           totalProfit += (order.totalAmount - orderCost);
        } catch(e) {
           totalProfit += (order.totalAmount * 0.3); // 30% margin fallback
        }
      });

      // 3. Preparação de Dados para Gráficos (Últimos 7 dias)
      const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dateStr = d.toISOString().split('T')[0];
        const daySales = orders
          .filter(o => o.createdAt.startsWith(dateStr))
          .reduce((acc, current) => acc + current.totalAmount, 0);
        
        return {
          name: d.toLocaleDateString('pt-BR', { weekday: 'short' }),
          vendas: daySales
        };
      });

      // 4. Dados Mensais (Últimos 6 meses)
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const monthlyStats = [...Array(6)].map((_, i) => {
         const d = new Date();
         d.setMonth(d.getMonth() - (5 - i));
         const mIdx = d.getMonth();
         const mSales = orders
           .filter(o => new Date(o.createdAt).getMonth() === mIdx)
           .reduce((acc, current) => acc + current.totalAmount, 0);
         
         return {
            name: months[mIdx],
            faturamento: mSales,
            lucro: mSales * 0.35 // Estimativa visual
         };
      });

      setStats({
        totalSales,
        dailySales,
        monthlySales,
        totalProfit,
        pendingOrders,
        totalProducts: products.length,
        avgTicket,
        lowStockItems,
        chartData: last7Days,
        monthlyData: monthlyStats
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Alerta de Novos Pedidos */}
      {stats.pendingOrders > 0 && (
        <div className="bg-primary border-l-8 border-l-secondary p-6 rounded-2xl flex items-center justify-between shadow-2xl animate-pulse">
           <div className="flex items-center gap-4 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                 <ShoppingBag className="text-secondary" size={24} />
              </div>
              <div>
                 <h4 className="font-black uppercase italic tracking-tighter text-xl">Novo Pedido Recebido!</h4>
                 <p className="text-sm opacity-80 font-medium tracking-wide">Você tem {stats.pendingOrders} {stats.pendingOrders === 1 ? 'pedido aguardando' : 'pedidos aguardando'} separação de carga.</p>
              </div>
           </div>
           <Button 
             onClick={() => navigate('/admin/pedidos')}
             className="bg-secondary hover:bg-secondary/80 border-none shadow-lg"
           >
             Ver Pedidos
           </Button>
        </div>
      )}

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Faturamento Total" 
          value={`R$ ${stats.totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          icon={TrendingUp} 
          color="bg-primary" 
          trend={12}
          loading={loading}
        />
        <StatCard 
          title="Lucro Estimado" 
          value={`R$ ${stats.totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          icon={DollarSign} 
          color="bg-secondary" 
          trend={8}
          loading={loading}
        />
        <StatCard 
          title="Vendas Hoje" 
          value={`R$ ${stats.dailySales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          icon={Wallet} 
          color="bg-blue-500" 
          loading={loading}
        />
        <StatCard 
          title="Ticket Médio" 
          value={`R$ ${stats.avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          icon={Package} 
          color="bg-orange-500" 
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico de Vendas Semanais */}
        <Card className="lg:col-span-2 p-8">
           <div className="flex items-center justify-between mb-8">
              <div>
                 <h4 className="text-lg font-black uppercase italic tracking-tighter text-primary">Volume de Vendas Semanal</h4>
                 <p className="text-xs text-outline font-bold uppercase tracking-widest mt-1">Últimos 7 dias de operação</p>
              </div>
              <TrendingUp className="text-secondary" />
           </div>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }}
                    tickFormatter={(value) => `R$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="vendas" 
                    stroke="#003554" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: '#0582CA', strokeWidth: 0 }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
           </div>
        </Card>

        {/* Alertas de Estoque e Resumo */}
        <div className="space-y-6">
           <Card className="bg-primary text-white border-none shadow-xl overflow-hidden relative">
              <div className="relative z-10">
                 <h4 className="text-sm font-black uppercase tracking-widest opacity-80 mb-2">Produtos no Catálogo</h4>
                 <p className="text-5xl font-black italic tracking-tighter mb-4">{stats.totalProducts}</p>
                 <Button 
                   variant="secondary" 
                   size="sm" 
                   className="w-full font-black uppercase italic text-[10px]"
                   onClick={() => navigate('/admin/produtos')}
                 >
                   Gerenciar Estoque <ArrowRight size={14} className="ml-2" />
                 </Button>
              </div>
              <Package className="absolute -right-6 -bottom-6 opacity-10" size={140} />
           </Card>

           {stats.lowStockItems.length > 0 && (
             <Card className="border-red-100 bg-red-50/50">
                <div className="flex items-center gap-2 text-red-600 mb-4">
                  <AlertTriangle size={20} />
                  <h4 className="font-black uppercase italic tracking-tighter">Estoque Crítico</h4>
                </div>
                <div className="space-y-3">
                  {stats.lowStockItems.slice(0, 3).map(item => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-red-100">
                      <span className="text-xs font-bold text-primary truncate max-w-[120px]">{item.name}</span>
                      <span className="text-[10px] font-black uppercase text-red-600 px-2 py-0.5 bg-red-100 rounded-full">
                        {item.stock} un
                      </span>
                    </div>
                  ))}
                  {stats.lowStockItems.length > 3 && (
                    <p className="text-[10px] text-center text-outline font-black uppercase">+{stats.lowStockItems.length - 3} itens abaixo da reserva</p>
                  )}
                </div>
             </Card>
           )}
        </div>
      </div>

      {/* Gráfico de Barras - Performance Mensal */}
      <Card className="p-8">
          <div className="mb-8">
            <h4 className="text-lg font-black uppercase italic tracking-tighter text-primary">Performance Financeira Semestral</h4>
            <p className="text-xs text-outline font-bold uppercase tracking-widest mt-1">Comparativo de Faturamento vs Lucro</p>
          </div>
          <div className="h-[350px] w-full">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748B' }} />
                  <Tooltip />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }} />
                  <Bar dataKey="faturamento" fill="#003554" radius={[4, 4, 0, 0]} barSize={40} />
                  <Bar dataKey="lucro" fill="#0582CA" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
             </ResponsiveContainer>
          </div>
      </Card>
    </div>
  );
}
