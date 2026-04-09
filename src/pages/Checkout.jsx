import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, Button, Input } from '../components/UI';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Truck, MapPin, CreditCard, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { cart, subtotal, totalWeight, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Pre-fill address if user is logged in
  const [formData, setFormData] = useState({
    zipCode: user?.address?.zipCode || '',
    street: user?.address?.street || '',
    number: user?.address?.number || '',
    complement: user?.address?.complement || '',
    city: user?.address?.city || '',
    state: user?.address?.state || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setLoading(true);
    try {
      await api.post('/orders', {
        items: JSON.stringify(cart),
        totalAmount: subtotal,
        userId: user.id
      });
      setSuccess(true);
      clearCart();
    } catch (err) {
      alert('Erro ao processar pedido');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-10">
           <Card className="max-w-md text-center py-16 space-y-6 glass">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                 <CheckCircle size={48} />
              </div>
              <h2 className="text-3xl font-black text-primary uppercase italic tracking-tighter">Pedido Realizado!</h2>
              <p className="text-outline">Seu pedido foi encaminhado para nossa equipe. Você pode acompanhar o status no seu painel.</p>
              <Button size="lg" className="w-full" onClick={() => navigate('/')}>Voltar para a Loja</Button>
           </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto py-10 px-4">
        <h2 className="text-4xl font-black text-primary uppercase italic tracking-tighter mb-10">Finalizar Compra</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Formulário de Entrega */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <h3 className="text-lg font-black uppercase italic tracking-tighter text-primary mb-6 flex items-center gap-2">
                <MapPin size={20} className="text-secondary" /> Endereço de Entrega
              </h3>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Input label="CEP" value={formData.zipCode} onChange={e => setFormData({...formData, zipCode: e.target.value})} />
                 <Input label="Número" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} />
                 <div className="md:col-span-2">
                   <Input label="Rua" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} />
                 </div>
                 <Input label="Cidade" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                 <Input label="Estado" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
              </form>
            </Card>

            <Card>
               <h3 className="text-lg font-black uppercase italic tracking-tighter text-primary mb-6 flex items-center gap-2">
                <CreditCard size={20} className="text-secondary" /> Forma de Pagamento
              </h3>
              <div className="p-4 border-2 border-primary bg-primary/5 rounded-2xl flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center">
                       <Truck size={24} />
                    </div>
                    <div>
                       <p className="font-bold text-primary">Pagamento na Entrega / PIX</p>
                       <p className="text-[10px] text-outline uppercase font-black">Combine com o entregador</p>
                    </div>
                 </div>
                 <CheckCircle className="text-primary" />
              </div>
            </Card>
          </div>

          {/* Resumo Final */}
          <div className="space-y-6">
            <Card className="border-2 border-primary/20">
               <h4 className="font-black uppercase italic tracking-tighter text-primary mb-6">Resumo Final</h4>
               <div className="space-y-4 mb-6">
                 {cart.map(item => (
                   <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-outline truncate max-w-[150px]">{item.name} x{item.quantity}</span>
                      <span className="font-bold">R$ {(item.finalPrice * item.quantity).toFixed(2)}</span>
                   </div>
                 ))}
               </div>

               <div className="space-y-4 border-t border-outline-variant pt-6">
                 <div className="flex justify-between text-sm">
                    <span className="text-outline uppercase font-black text-[10px]">Peso Total da Carga</span>
                    <span className="font-black">{totalWeight.toFixed(2)} kg</span>
                 </div>
                 <div className="flex justify-between items-center text-2xl font-black text-primary">
                    <span className="italic uppercase tracking-tighter">Total</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                 </div>
               </div>

               <Button size="lg" className="w-full mt-8 h-16 font-black uppercase italic text-lg" disabled={loading || cart.length === 0} onClick={handleSubmit}>
                  {loading ? 'Processando...' : <><CheckCircle className="mr-2" /> Confirmar Pedido</>}
               </Button>
               <p className="text-[10px] text-center text-outline mt-4 font-medium px-4">
                  Ao confirmar, seu pedido será processado pela Natan Construções e entraremos em contato.
               </p>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
