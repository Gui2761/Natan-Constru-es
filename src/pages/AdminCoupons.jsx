import React from 'react';
import { Ticket, Plus, Search, Tag, AlertCircle } from 'lucide-react';
import { Button } from '../components/UI';

export default function AdminCoupons() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-surface p-6 rounded-2xl border border-outline-variant shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-primary uppercase italic tracking-tighter">
            Gestão de Cupons
          </h2>
          <p className="text-sm text-outline">
            Crie códigos de desconto promocionais para seus clientes.
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={20} />
          Novo Cupom
        </Button>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-primary shadow-lg mb-6">
          <Ticket size={40} />
        </div>
        <h3 className="text-xl font-black text-primary uppercase italic tracking-tighter mb-2">
          Nenhum Cupom Ativo
        </h3>
        <p className="text-sm text-outline max-w-md mx-auto mb-6">
          Você ainda não cadastrou nenhum cupom de desconto. Crie cupons sazonais, como "BLACKFRIDAY" ou "BEMVINDO", para impulsionar suas vendas.
        </p>
        
        <div className="flex items-center gap-2 text-secondary bg-secondary/10 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide">
          <AlertCircle size={16} />
          <span>Módulo em fase de implantação técnica</span>
        </div>
      </div>
    </div>
  );
}
