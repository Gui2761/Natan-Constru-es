import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, Button, Input } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Save, ArrowLeft, Camera, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useSEO from '../hooks/useSEO';

export default function Profile() {
  useSEO({ 
    title: "Meu Perfil", 
    description: "Gerencie suas informações pessoais, endereços e acompanhe seus pedidos na Natan Construções." 
  });

  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    address: {
      zipCode: user?.address?.zipCode || '',
      street: user?.address?.street || '',
      number: user?.address?.number || '',
      city: user?.address?.city || '',
      state: user?.address?.state || ''
    }
  });

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        address: {
          zipCode: user.address?.zipCode || '',
          street: user.address?.street || '',
          number: user.address?.number || '',
          city: user.address?.city || '',
          state: user.address?.state || ''
        }
      });
      setAvatarPreview(user.avatar);
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      if (formData.password) data.append('password', formData.password);
      data.append('address', JSON.stringify(formData.address));
      if (avatar) data.append('avatar', avatar);

      await updateProfile(data);
      alert('Perfil atualizado com sucesso!');
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background blueprint-bg">
      <Header />

      <main className="max-w-4xl mx-auto py-12 px-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-outline hover:text-primary mb-8 font-bold uppercase text-[10px] tracking-widest bg-surface-container px-4 py-2 rounded-full border border-outline-variant transition-colors">
           <ArrowLeft size={14} /> Voltar para a obra
        </button>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Lado Esquerdo: Avatar & Resumo */}
          <Card className="w-full md:w-80 shrink-0 flex flex-col items-center text-center p-8 glass">
             <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-primary ring-8 ring-primary/5 overflow-hidden bg-surface-container">
                   {avatarPreview ? (
                      <img src={avatarPreview} className="w-full h-full object-cover" alt={user?.name} />
                   ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary font-black text-3xl italic">
                         {user?.name?.charAt(0)}
                      </div>
                   )}
                </div>
                <label className="absolute bottom-0 right-0 bg-secondary text-white p-2.5 rounded-full cursor-pointer shadow-xl hover:scale-110 transition-transform active:scale-95">
                   <Camera size={18} />
                   <input 
                     type="file" 
                     className="hidden" 
                     accept="image/*"
                     onChange={e => {
                       const file = e.target.files[0];
                       if (file) {
                         setAvatar(file);
                         setAvatarPreview(URL.createObjectURL(file));
                       }
                     }}
                   />
                </label>
             </div>
             <h3 className="mt-6 text-xl font-black text-primary uppercase italic tracking-tighter">{user?.name}</h3>
             <p className="text-xs text-outline font-bold uppercase tracking-widest mt-1">{user?.role === 'ADMIN' ? '🛠️ Administrador' : '👷 Cliente Natan'}</p>
             <div className="w-full border-t border-outline-variant my-6"></div>
             <div className="grid grid-cols-2 w-full gap-4">
                <div className="text-left">
                   <p className="text-[10px] text-outline font-black uppercase">Desde</p>
                   <p className="font-bold text-sm">{new Date(user?.createdAt).getFullYear()}</p>
                </div>
                <div className="text-left">
                   <p className="text-[10px] text-outline font-black uppercase">Pedidos</p>
                   <p className="font-bold text-sm">{user?.orders?.length || 0}</p>
                </div>
             </div>
          </Card>

          {/* Lado Direito: Formulários */}
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl font-black text-primary uppercase italic tracking-tighter mb-2">Configurações de Conta</h2>
            
            <form onSubmit={handleSave} className="space-y-6">
               <Card className="space-y-6">
                  <h3 className="text-lg font-black uppercase italic tracking-tighter text-primary flex items-center gap-2">
                    <User size={20} className="text-secondary" /> Informações do Profissional
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <Input 
                       label="Nome Completo" 
                       value={formData.name} 
                       maxLength={50}
                       onChange={e => setFormData({...formData, name: e.target.value})}
                       required 
                     />
                     <Input 
                       label="E-mail de Acesso" 
                       type="email" 
                       value={formData.email} 
                       maxLength={100}
                       onChange={e => setFormData({...formData, email: e.target.value})}
                       required 
                     />
                     <div className="md:col-span-2">
                        <Input 
                          label="Nova Senha (deixe em branco para manter)" 
                          type="password" 
                          placeholder="••••••••"
                          maxLength={20}
                          value={formData.password} 
                          onChange={e => setFormData({...formData, password: e.target.value})}
                        />
                        <p className="text-[10px] text-outline mt-2 flex items-center gap-1 font-bold italic uppercase"><Lock size={10} /> Sua segurança é nossa prioridade</p>
                     </div>
                  </div>
               </Card>

               <Card className="space-y-6">
                  <h3 className="text-lg font-black uppercase italic tracking-tighter text-primary flex items-center gap-2">
                    <MapPin size={20} className="text-secondary" /> Endereço Principal
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <Input 
                       label="CEP" 
                       value={formData.address.zipCode} 
                       maxLength={9}
                       onChange={e => {
                         const val = e.target.value.replace(/\D/g, '').substring(0, 8);
                         const formatted = val.length > 5 ? `${val.substring(0, 5)}-${val.substring(5)}` : val;
                         setFormData({...formData, address: {...formData.address, zipCode: formatted}});
                       }}
                       placeholder="00000-000"
                     />
                     <Input 
                       label="Número" 
                       value={formData.address.number} 
                       maxLength={10}
                       onChange={e => setFormData({...formData, address: {...formData.address, number: e.target.value}})}
                       placeholder="Ex: 123"
                     />
                     <div className="md:col-span-2">
                        <Input 
                          label="Rua / Avenida" 
                          value={formData.address.street} 
                          maxLength={100}
                          onChange={e => setFormData({...formData, address: {...formData.address, street: e.target.value}})}
                          placeholder="Nome da via"
                        />
                     </div>
                     <Input 
                       label="Cidade" 
                       value={formData.address.city} 
                       maxLength={50}
                       onChange={e => setFormData({...formData, address: {...formData.address, city: e.target.value}})}
                     />
                     <Input 
                       label="Estado (UF)" 
                       value={formData.address.state} 
                       maxLength={2}
                       onChange={e => setFormData({...formData, address: {...formData.address, state: e.target.value.toUpperCase()}})}
                       placeholder="Ex: SP"
                     />
                  </div>
               </Card>

               <div className="flex justify-end gap-4 pb-10">
                  <Button variant="outline" type="button" onClick={() => navigate(-1)} className="px-8">Descartar</Button>
                  <Button size="lg" disabled={loading} className="px-12 h-14 font-black uppercase italic tracking-widest shadow-blueprint">
                     {loading ? 'Sincronizando...' : <><Save size={20} className="mr-2"/> Salvar Alterações</>}
                  </Button>
               </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
