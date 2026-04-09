import React from 'react';
import { Card } from '../components/UI';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Wallet 
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card className="flex items-center gap-6">
    <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-${color.split('-')[1]}`}>
      <Icon size={32} />
    </div>
    <div>
      <p className="text-sm font-medium text-outline">{title}</p>
      <h3 className="text-2xl font-black">{value}</h3>
    </div>
  </Card>
);

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Vendas Hoje" value="R$ 1.250,00" icon={Wallet} color="bg-green-600" />
        <StatCard title="Novos Pedidos" value="12" icon={ShoppingBag} color="bg-primary" />
        <StatCard title="Novos Clientes" value="48" icon={Users} color="bg-blue-600" />
        <StatCard title="Total no Mês" value="R$ 45.300,00" icon={TrendingUp} color="bg-secondary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h4 className="text-lg font-black mb-6 uppercase tracking-tighter italic">Pedidos Recentes</h4>
          <div className="space-y-4">
            <p className="text-sm text-outline italic">Nenhum pedido processado hoje.</p>
          </div>
        </Card>

        <Card>
          <h4 className="text-lg font-black mb-6 uppercase tracking-tighter italic">Produtos mais Vendidos</h4>
          <div className="space-y-4">
            <p className="text-sm text-outline italic">Aguardando dados de vendas.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
