import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, Button, Input } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // No mundo real, aqui teríamos um handleSave chamando a API de Update User
  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Perfil atualizado com sucesso! (Simulação)');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-3xl mx-auto py-10 px-4 mt-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-outline hover:text-primary mb-8 font-bold uppercase text-xs tracking-widest">
           <ArrowLeft size={16} /> Voltar
        </button>

        <h2 className="text-4xl font-black text-primary uppercase italic tracking-tighter mb-10">Meus Dados</h2>

        <form onSubmit={handleSave} className="space-y-8">
           <Card className="space-y-6">
              <h3 className="text-lg font-black uppercase italic tracking-tighter text-primary flex items-center gap-2">
                <User size={20} className="text-secondary" /> Informações Básicas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Input label="Nome Completo" defaultValue={user?.name} required />
                 <Input label="E-mail" type="email" defaultValue={user?.email} required disabled />
              </div>
           </Card>

           <Card className="space-y-6">
              <h3 className="text-lg font-black uppercase italic tracking-tighter text-primary flex items-center gap-2">
                <MapPin size={20} className="text-secondary" /> Endereço de Obra
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Input label="CEP" defaultValue={user?.address?.zipCode} />
                 <Input label="Número" defaultValue={user?.address?.number} />
                 <div className="md:col-span-2">
                    <Input label="Rua" defaultValue={user?.address?.street} />
                 </div>
                 <Input label="Cidade" defaultValue={user?.address?.city} />
                 <Input label="Estado" defaultValue={user?.address?.state} />
              </div>
           </Card>

           <div className="flex justify-end gap-4">
              <Button variant="outline" type="button" onClick={() => navigate(-1)}>Cancelar</Button>
              <Button size="lg" disabled={loading} className="px-10">
                 {loading ? 'Salvando...' : <><Save size={18} className="mr-2"/> Atualizar Dados</>}
              </Button>
           </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
