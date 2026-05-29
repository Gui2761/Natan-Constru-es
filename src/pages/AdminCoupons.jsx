import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../components/UI';
import { Ticket, Plus, Trash2, Calendar, Percent, AlertTriangle, Edit2, X } from 'lucide-react';
import api from '../services/api';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', expiresAt: '' });
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, couponId: null });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingCoupon) {
        await api.put(`/coupons/${editingCoupon.id}`, newCoupon);
        setEditingCoupon(null);
      } else {
        await api.post('/coupons', newCoupon);
      }
      setNewCoupon({ code: '', discount: '', expiresAt: '' });
      fetchCoupons();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao salvar cupom');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (coupon) => {
    setEditingCoupon(coupon);
    setNewCoupon({
      code: coupon.code,
      discount: coupon.discount,
      expiresAt: coupon.expiresAt ? coupon.expiresAt.substring(0, 10) : ''
    });
  };

  const handleCancelEdit = () => {
    setEditingCoupon(null);
    setNewCoupon({ code: '', discount: '', expiresAt: '' });
  };

  const handleDelete = (id) => {
    setConfirmModal({ isOpen: true, couponId: id });
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/coupons/${confirmModal.couponId}`);
      if (editingCoupon && editingCoupon.id === confirmModal.couponId) {
        handleCancelEdit();
      }
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
        {/* Formulário Novo/Editar Cupom */}
        <Card className="lg:col-span-1 h-fit sticky top-8">
           <div className="flex justify-between items-center mb-6">
             <h3 className="font-black uppercase italic tracking-tighter text-primary flex items-center gap-2">
               {editingCoupon ? (
                 <>
                   <Edit2 size={20} className="text-secondary" /> Editar Cupom
                 </>
               ) : (
                 <>
                   <Plus size={20} className="text-secondary" /> Novo Cupom
                 </>
               )}
             </h3>
             {editingCoupon && (
               <button 
                 onClick={handleCancelEdit} 
                 className="p-1.5 text-outline hover:text-primary hover:bg-outline/5 rounded-lg transition-all"
                 title="Cancelar Edição"
               >
                 <X size={16} />
               </button>
             )}
           </div>
           <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex gap-2">
                {editingCoupon && (
                  <Button type="button" variant="outline" className="flex-1" onClick={handleCancelEdit}>
                    Cancelar
                  </Button>
                )}
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? 'Salvando...' : editingCoupon ? 'Salvar Alterações' : 'Criar Cupom'}
                </Button>
              </div>
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
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleEditClick(coupon)}
                    className="p-3 text-primary hover:bg-primary/5 rounded-xl transition-colors"
                    title="Editar Cupom"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button 
                    onClick={() => handleDelete(coupon.id)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="Excluir Cupom"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Custom Confirm Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Card className="max-w-md w-full p-6 space-y-6 shadow-2xl scale-in duration-200 bg-surface border border-outline-variant/30 hover-premium">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center border border-red-200">
                <AlertTriangle size={24} />
              </div>
              <h4 className="text-lg font-black uppercase italic tracking-tighter text-primary">Ação Irreversível</h4>
              <p className="text-sm text-outline font-medium">Deseja realmente remover este cupom? Esta ação é definitiva.</p>
            </div>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="flex-1 font-bold uppercase tracking-wider text-xs" 
                onClick={() => setConfirmModal({ isOpen: false, couponId: null })}
              >
                Voltar
              </Button>
              <Button 
                className="flex-1 bg-red-600 hover:bg-red-700 border-none text-white font-bold uppercase tracking-wider text-xs shadow-lg" 
                onClick={() => {
                  handleConfirmDelete();
                  setConfirmModal({ isOpen: false, couponId: null });
                }}
              >
                Confirmar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
