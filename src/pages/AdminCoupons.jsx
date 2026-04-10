import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../components/UI';
import { Ticket, Plus, Trash2, Calendar, Percent } from 'lucide-react';
import api from '../services/api';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', expiresAt: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await api.get('/coupons');
      setCoupons(res.data);
    } catch (err) {
      console.error('Erro ao buscar cupons');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/coupons', newCoupon);
      setNewCoupon({ code: '', discount: '', expiresAt: '' });
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao criar cupom');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja remover este cupom?')) return;
    try {
      await api.delete(`/coupons/${id}`);
      fetchCoupons();
    } catch (err) {
      alert('Erro ao deletar cupom');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-primary uppercase italic tracking-tighter">Gerenciar Cupons</h2>
          <p className="text-outline text-sm">Crie códigos promocionais para seus clientes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário Novo Cupom */}
        <Card className="lg:col-span-1 h-fit sticky top-8">
           <h3 className="font-black uppercase italic tracking-tighter text-primary mb-6 flex items-center gap-2">
             <Plus size={20} className="text-secondary" /> Novo Cupom
           </h3>
           <form onSubmit={handleCreate} className="space-y-4">
              <Input 
                label="Código (Ex: NATAN10)" 
                value={newCoupon.code} 
                onChange={e => setNewCoupon({...newCoupon, code: e.target.value})} 
                required 
              />
              <Input 
                label="Desconto (%)" 
                type="number" 
                value={newCoupon.discount} 
                onChange={e => setNewCoupon({...newCoupon, discount: e.target.value})} 
                required 
              />
              <Input 
                label="Expira em (Opcional)" 
                type="date" 
                value={newCoupon.expiresAt} 
                onChange={e => setNewCoupon({...newCoupon, expiresAt: e.target.value})} 
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Criando...' : 'Criar Cupom'}
              </Button>
           </form>
        </Card>

        {/* Lista de Cupons */}
        <div className="lg:col-span-2 space-y-4">
          {coupons.length === 0 ? (
            <Card className="text-center py-20 grayscale opacity-50">
               <Ticket size={48} className="mx-auto mb-4 text-outline" />
               <p className="font-bold text-outline">Nenhum cupom ativo no momento.</p>
            </Card>
          ) : (
            coupons.map(coupon => (
              <Card key={coupon.id} className="flex items-center justify-between group hover:border-primary transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center font-black italic">
                    <Ticket size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-primary tracking-tighter italic">{coupon.code}</h4>
                    <div className="flex items-center gap-3 text-xs text-outline font-bold uppercase">
                      <span className="flex items-center gap-1 text-secondary"><Percent size={12} /> {coupon.discount}% OFF</span>
                      {coupon.expiresAt && (
                        <span className="flex items-center gap-1"><Calendar size={12} /> Expira: {new Date(coupon.expiresAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(coupon.id)}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
