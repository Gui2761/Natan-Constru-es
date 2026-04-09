import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-20 pb-10 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-white/10 pb-12">
        {/* Institucional */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter">
            Natan <span className="text-secondary">Construções</span>
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Há mais de 10 anos sendo a fundação de confiança das suas obras. Materiais de qualidade e atendimento especializado.
          </p>
          <div className="flex gap-4">
            <Facebook className="hover:text-secondary cursor-pointer transition-colors" />
            <Instagram className="hover:text-secondary cursor-pointer transition-colors" />
            <Youtube className="hover:text-secondary cursor-pointer transition-colors" />
          </div>
        </div>

        {/* Links Úteis */}
        <div>
          <h4 className="font-bold uppercase tracking-widest text-secondary text-sm mb-8">Atendimento</h4>
          <ul className="space-y-4 text-sm text-white/80">
            <li><Link to="/sobre" className="hover:text-secondary">Sobre Nós</Link></li>
            <li><Link to="/ajuda" className="hover:text-secondary">Dúvidas Frequentes</Link></li>
            <li><Link to="/politica" className="hover:text-secondary">Trocas e Devoluções</Link></li>
            <li><Link to="/contato" className="hover:text-secondary">Fale Conosco</Link></li>
          </ul>
        </div>

        {/* Categorias Populares */}
        <div>
          <h4 className="font-bold uppercase tracking-widest text-secondary text-sm mb-8">Navegação</h4>
          <ul className="space-y-4 text-sm text-white/80">
            <li><Link to="/admin" className="hover:text-secondary">Painel Administrativo</Link></li>
            <li><Link to="/login" className="hover:text-secondary">Minha Conta</Link></li>
            <li><Link to="/carrinho" className="hover:text-secondary">Carrinho de Compras</Link></li>
            <li><Link to="/produtos" className="hover:text-secondary">Ofertas do Dia</Link></li>
          </ul>
        </div>

        {/* Contato Direto */}
        <div>
          <h4 className="font-bold uppercase tracking-widest text-secondary text-sm mb-8">Onde Estamos</h4>
          <ul className="space-y-6">
            <li className="flex gap-3 items-start">
              <MapPin className="text-secondary shrink-0" size={20} />
              <p className="text-sm text-white/80">Av. Principal das Construções, 1500 - Centro, Cidade/UF</p>
            </li>
            <li className="flex gap-3 items-center">
              <Phone className="text-secondary shrink-0" size={20} />
              <p className="text-sm font-bold">(11) 99999-9999</p>
            </li>
            <li className="flex gap-3 items-center">
              <Mail className="text-secondary shrink-0" size={20} />
              <p className="text-sm text-white/80">vendas@natanconstrucoes.com.br</p>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] text-white/40 uppercase font-medium tracking-widest">
          © 2026 Natan Construções - Todos os direitos reservados. CNPJ: 00.000.000/0001-00
        </p>
        <div className="flex gap-4 items-center opacity-40">
           <div className="flex items-center gap-1 border border-white/20 px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase">
              <span className="text-secondary tracking-tighter italic text-xs">V</span>isa
           </div>
           <div className="flex items-center gap-1 border border-white/20 px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase">
              <div className="flex -space-x-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500 opacity-80"></div>
              </div>
              Master
           </div>
           <div className="flex items-center gap-1 border border-white/20 px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase">
              <div className="w-2 h-2 bg-secondary rotate-45"></div>
              Pix
           </div>
        </div>
      </div>
    </footer>
  );
}
