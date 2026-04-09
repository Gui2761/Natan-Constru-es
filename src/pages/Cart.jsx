import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, Button } from '../components/UI';
import { useCart } from '../context/CartContext';
import { Trash2, FileText, ArrowRight, ShoppingBag, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function Cart() {
  const { cart, removeFromCart, subtotal, totalWeight } = useCart();
  const navigate = useNavigate();

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('NATAN CONSTRUÇÕES - ORÇAMENTO', 10, 20);
    doc.setFontSize(10);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, 10, 30);
    doc.text(`Peso Total Estimado: ${totalWeight.toFixed(2)} kg`, 10, 35);

    const tableData = cart.map(item => [
      item.name,
      item.quantity,
      `R$ ${item.finalPrice.toFixed(2)}`,
      `R$ ${(item.finalPrice * item.quantity).toFixed(2)}`
    ]);

    doc.autoTable({
      head: [['Produto', 'Qtd', 'Preço Unit.', 'Total']],
      body: tableData,
      startY: 45
    });

    doc.text(`Total do Orçamento: R$ ${subtotal.toFixed(2)}`, 140, doc.autoTable.previous.finalY + 10);
    doc.save('orcamento_natan.pdf');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto py-10 px-4 lg:px-0">
        <h2 className="text-4xl font-black text-primary uppercase italic tracking-tighter mb-10 flex items-center gap-4">
          <ShoppingBag size={40} /> Seu Carrinho
        </h2>

        {cart.length === 0 ? (
          <Card className="text-center py-20 bg-surface-container/50 border-dashed">
            <Package size={60} className="mx-auto text-outline/30 mb-6" />
            <h3 className="text-xl font-bold text-outline uppercase tracking-widest">O carrinho está vazio</h3>
            <p className="text-outline mt-2 mb-8">Comece a adicionar materiais para sua obra!</p>
            <Button onClick={() => navigate('/')}>Voltar para Ofertas</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Lista de Itens */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => (
                <Card key={item.id} className="flex gap-6 items-center">
                  <div className="w-24 h-24 bg-surface-container rounded-2xl overflow-hidden shrink-0">
                    <img src={item.images} className="w-full h-full object-cover" alt={item.name} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-primary uppercase text-sm">{item.name}</h4>
                    <p className="text-outline text-xs mt-1">Peso: {item.weight} kg/un</p>
                    <div className="mt-4 flex items-center justify-between">
                       <span className="font-black text-primary">R$ {item.finalPrice.toFixed(2)} <span className="text-outline font-medium text-xs">x {item.quantity}</span></span>
                       <Button variant="ghost" className="text-error" onClick={() => removeFromCart(item.id)}>
                         <Trash2 size={18} />
                       </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Resumo e Ações */}
            <div className="space-y-6">
              <Card className="bg-primary text-white border-0 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <ShoppingBag size={80} />
                </div>
                <h4 className="font-black uppercase italic tracking-tighter text-secondary mb-8">Resumo do Pedido</h4>
                
                <div className="space-y-4 border-b border-white/10 pb-6 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Subtotal:</span>
                    <span className="font-bold">R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Peso Total:</span>
                    <span className="font-bold">{totalWeight.toFixed(2)} kg</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-10">
                   <span className="font-bold uppercase tracking-widest text-xs">Total Estimado</span>
                   <span className="text-3xl font-black text-secondary">R$ {subtotal.toFixed(2)}</span>
                </div>

                <Button variant="secondary" className="w-full h-16 font-black uppercase text-base italic" onClick={() => navigate('/checkout')}>
                   Ir para Checkout <ArrowRight className="ml-2" />
                </Button>
              </Card>

              <Button variant="outline" className="w-full h-14 border-primary/20 text-primary uppercase font-black text-xs tracking-widest" onClick={generatePDF}>
                <FileText className="mr-2 w-4 h-4" /> Gerar Orçamento em PDF
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
