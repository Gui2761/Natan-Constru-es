import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, Button, Input } from '../components/UI';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Truck, MapPin, CreditCard, ArrowRight, Ticket, Tag, Download, MessageCircle } from 'lucide-react';
import { generateBlueprintPDF } from '../utils/pdfGenerator';

import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const { cart, subtotal, totalWeight, clearCart, total, coupon, applyCoupon, discountAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponResult, setCouponResult] = useState(null);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [shippingService, setShippingService] = useState('PAC');

  // Pre-fill address if user is logged in
  const [formData, setFormData] = useState({
    zipCode: user?.address?.zipCode || '',
    street: user?.address?.street || '',
    number: user?.address?.number || '',
    complement: user?.address?.complement || '',
    city: user?.address?.city || '',
    state: user?.address?.state || ''
  });

  // Dynamic CEP auto-fill via ViaCEP API
  const handleCepLookup = async (cep) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            street: data.logradouro || '',
            city: data.localidade || '',
            state: data.uf || ''
          }));
        }
      } catch (err) {
        console.error("Erro ao consultar CEP", err);
      }
    }
  };

  // Calculate Shipping based on totalWeight, State (UF) and Service (PAC vs SEDEX)
  const calculateShipping = () => {
    if (!formData.state || totalWeight === 0) return 0;
    const base = shippingService === 'SEDEX' ? 28.0 : 15.0;
    const rate = shippingService === 'SEDEX' ? 2.10 : 1.20;
    const weightFee = totalWeight * rate;
    
    const state = formData.state.toUpperCase().trim();
    let multiplier = 2.2; // default outer state
    if (state === 'SE') multiplier = 1.0; // Local rate for Sergipe
    else if (['AL', 'BA', 'PE'].includes(state)) multiplier = 1.5; // Regional rate for neighboring Northeast states
    
    return base + (weightFee * multiplier);
  };

  const shippingCost = calculateShipping();
  const grandTotal = total + shippingCost;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setLoading(true);
    try {
      const { data } = await api.post('/orders', {
        items: JSON.stringify(cart),
        totalAmount: grandTotal,
        userId: user.id
      });

      // Attach full details for successful order summary
      const orderSummary = {
        ...data,
        items: cart,
        totalWeight,
        shippingCost,
        shippingService,
        user: {
          ...user,
          address: formData
        }
      };

      setCreatedOrder(orderSummary);
      setSuccess(true);
      clearCart();
    } catch (err) {
      alert('Erro ao processar pedido');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    const generateWhatsAppLink = () => {
      if (!createdOrder) return '';
      const orderId = createdOrder.id || 'N/A';
      const itemsList = createdOrder.items.map(item => `• ${item.name} (x${item.quantity}) - R$ ${(item.finalPrice * item.quantity).toFixed(2)}`).join('\n');
      
      const text = `*NOVO PEDIDO - NATAN CONSTRUÇÕES* 🏗️\n\n` +
        `*Pedido:* #${orderId}\n` +
        `*Cliente:* ${createdOrder.user.name}\n` +
        `*Endereço:* ${createdOrder.user.address.street}, ${createdOrder.user.address.number} - ${createdOrder.user.address.city}/${createdOrder.user.address.state}\n\n` +
        `*Itens do Pedido:*\n${itemsList}\n\n` +
        `*Peso da Carga:* ${createdOrder.totalWeight.toFixed(2)} kg\n` +
        `*Frete Logístico (${createdOrder.shippingService}):* R$ ${createdOrder.shippingCost.toFixed(2)}\n` +
        `*VALOR TOTAL:* R$ ${createdOrder.totalAmount.toFixed(2)}\n\n` +
        `*Gostaria de agendar a entrega do meu material!*`;
      
      return `https://wa.me/5511999999999?text=${encodeURIComponent(text)}`;
    };

    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-10 bg-blueprint-grid relative overflow-hidden">
          <div className="absolute inset-0 radial-blueprint-glow pointer-events-none"></div>
           <Card className="max-w-md w-full text-center py-12 px-8 space-y-6 shadow-2xl relative z-10 hover-premium bg-white">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                 <CheckCircle size={48} />
              </div>
              <div className="space-y-2">
                <span className="bg-secondary/10 text-secondary text-[10px] font-black uppercase px-2 py-1 rounded">
                  Status: Processando Orçamento
                </span>
                <h2 className="text-3xl font-black text-primary uppercase italic tracking-tighter">Pedido Realizado!</h2>
              </div>
              <p className="text-outline text-sm">
                Seu pedido foi encaminhado no sistema. Para garantir o melhor prazo de frete e separação rápida, faça o download do orçamento e envie ao nosso atendimento no WhatsApp!
              </p>
              
              <div className="flex flex-col gap-3 pt-4">
                <Button 
                  size="md" 
                  className="w-full bg-[#25D366] text-white hover:bg-[#20ba5a] font-black uppercase italic tracking-wider flex items-center justify-center gap-2 h-14" 
                  onClick={() => window.open(generateWhatsAppLink(), '_blank')}
                >
                  <MessageCircle size={20} /> Agendar via WhatsApp
                </Button>

                <Button 
                  size="md" 
                  variant="outline" 
                  className="w-full font-black uppercase italic tracking-wider flex items-center justify-center gap-2 h-14" 
                  onClick={() => generateBlueprintPDF(createdOrder)}
                >
                  <Download size={20} /> Baixar Orçamento PDF
                </Button>
              </div>

              <div className="border-t border-outline-variant pt-6">
                <Button variant="ghost" size="sm" className="w-full text-xs font-bold uppercase" onClick={() => navigate('/')}>
                  Voltar para a Loja
                </Button>
              </div>
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
                 <Input 
                   label="CEP" 
                   value={formData.zipCode} 
                   maxLength={9}
                   onChange={e => {
                     const val = e.target.value.replace(/\D/g, '').substring(0, 8);
                     const formatted = val.length > 5 ? `${val.substring(0, 5)}-${val.substring(5)}` : val;
                     setFormData({...formData, zipCode: formatted});
                     handleCepLookup(val);
                   }} 
                 />
                 <Input 
                   label="Número" 
                   value={formData.number} 
                   maxLength={10}
                   onChange={e => setFormData({...formData, number: e.target.value})} 
                 />
                 <div className="md:col-span-2">
                   <Input 
                     label="Rua" 
                     value={formData.street} 
                     maxLength={100}
                     onChange={e => setFormData({...formData, street: e.target.value})} 
                   />
                 </div>
                 <Input 
                   label="Cidade" 
                   value={formData.city} 
                   maxLength={50}
                   onChange={e => setFormData({...formData, city: e.target.value})} 
                 />
                 <Input 
                   label="Estado" 
                   value={formData.state} 
                   maxLength={2}
                   onChange={e => setFormData({...formData, state: e.target.value.toUpperCase()})} 
                 />
              </form>
            </Card>

            {/* Seletor de Frete Correios */}
            <Card>
               <h3 className="text-lg font-black uppercase italic tracking-tighter text-primary mb-6 flex items-center gap-2">
                <Truck size={20} className="text-secondary" /> Opção de Frete (Correios)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className={`p-4 border-2 rounded-2xl cursor-pointer transition-all flex items-center justify-between ${shippingService === 'PAC' ? 'border-primary bg-primary/5 shadow-md scale-[1.01]' : 'border-outline-variant hover:border-primary/50'}`}
                  onClick={() => setShippingService('PAC')}
                >
                  <div className="flex items-center gap-3">
                    <Truck className="text-primary" />
                    <div>
                      <p className="font-bold text-primary">Correios PAC</p>
                      <p className="text-[10px] text-outline uppercase font-black">Entrega Normal Logística</p>
                    </div>
                  </div>
                  <span className="font-black text-primary">
                    {formData.state ? `R$ ${(15.0 + totalWeight * 1.20 * (formData.state === 'SE' ? 1.0 : ['AL','BA','PE'].includes(formData.state) ? 1.5 : 2.2)).toFixed(2)}` : 'Preencha o CEP'}
                  </span>
                </div>

                <div 
                  className={`p-4 border-2 rounded-2xl cursor-pointer transition-all flex items-center justify-between ${shippingService === 'SEDEX' ? 'border-primary bg-primary/5 shadow-md scale-[1.01]' : 'border-outline-variant hover:border-primary/50'}`}
                  onClick={() => setShippingService('SEDEX')}
                >
                  <div className="flex items-center gap-3">
                    <Truck className="text-secondary" />
                    <div>
                      <p className="font-bold text-primary">Correios SEDEX</p>
                      <p className="text-[10px] text-outline uppercase font-black">Entrega Rápida Expressa</p>
                    </div>
                  </div>
                  <span className="font-black text-primary">
                    {formData.state ? `R$ ${(28.0 + totalWeight * 2.10 * (formData.state === 'SE' ? 1.0 : ['AL','BA','PE'].includes(formData.state) ? 1.5 : 2.2)).toFixed(2)}` : 'Preencha o CEP'}
                  </span>
                </div>
              </div>
            </Card>

            <Card>
               <h3 className="text-lg font-black uppercase italic tracking-tighter text-primary mb-6 flex items-center gap-2">
                <CreditCard size={20} className="text-secondary" /> Pagamento & Fechamento
              </h3>
              <div className="p-4 border-2 border-primary bg-primary/5 rounded-2xl flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center font-black italic shadow-lg">
                       W
                    </div>
                    <div>
                       <p className="font-bold text-primary">A Combinar no WhatsApp</p>
                       <p className="text-[10px] text-outline uppercase font-black">PIX, Link de Pagamento ou Maquininha na Entrega</p>
                    </div>
                 </div>
                 <CheckCircle className="text-primary" />
              </div>
            </Card>

            {/* Seção de Cupom */}
            <Card className="border-dashed border-2 border-secondary/30 bg-secondary/5">
              <h3 className="text-lg font-black uppercase italic tracking-tighter text-primary mb-4 flex items-center gap-2">
                <Ticket size={20} className="text-secondary" /> Possui um Cupom?
              </h3>
              <div className="flex gap-4">
                <div className="flex-1">
                   <Input 
                     placeholder="Digite o código" 
                     value={couponCode} 
                     onChange={e => setCouponCode(e.target.value)}
                     disabled={!!coupon}
                   />
                </div>
                <Button 
                  variant={coupon ? "secondary" : "primary"}
                  onClick={async () => {
                    if (coupon) return;
                    const res = await applyCoupon(couponCode);
                    setCouponResult(res);
                  }}
                  className="px-8"
                  disabled={!couponCode || !!coupon}
                >
                  {coupon ? 'Aplicado!' : 'Aplicar'}
                </Button>
              </div>
              {couponResult && !couponResult.success && (
                <p className="text-red-500 text-xs mt-2 font-bold uppercase">{couponResult.message}</p>
              )}
              {coupon && (
                <p className="text-green-600 text-xs mt-2 font-bold uppercase">Cupom {coupon.code} aplicado com sucesso!</p>
              )}
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
                  <div className="flex justify-between text-sm">
                     <span className="text-outline uppercase font-black text-[10px] flex items-center gap-1"><Truck size={14} /> Frete Logístico</span>
                     <span className="font-black">{shippingCost > 0 ? `R$ ${shippingCost.toFixed(2)}` : 'Digite o Estado'}</span>
                  </div>
                  {coupon && (
                    <div className="flex justify-between text-sm text-green-600 py-2 border-y border-green-100 italic font-bold">
                       <span className="flex items-center gap-1"><Tag size={14} /> Desconto ({coupon.discount}%)</span>
                       <span>- R$ {discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-4xl font-black text-primary pt-2">
                     <span className="italic uppercase tracking-tighter">Total</span>
                     <span>R$ {grandTotal.toFixed(2)}</span>
                  </div>
                </div>

               <Button size="lg" className="w-full mt-8 h-16 font-black uppercase italic text-lg shadow-blueprint hover-premium" disabled={loading || cart.length === 0} onClick={handleSubmit}>
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
