import React, { useState } from 'react';
import { Button, Input, Card } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, FileText, Truck, MessageCircle, ArrowLeft } from 'lucide-react';
import useSEO from '../hooks/useSEO';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);

  useSEO({ 
    title: isLogin ? "Entrar" : "Criar Conta", 
    description: "Acesse sua conta na Natan Construções para gerenciar seus pedidos e aproveitar ofertas exclusivas." 
  });

  const [loading, setLoading] = useState(false);
  const { login, register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleGoogleCallback = async (response) => {
    setLoading(true);
    try {
      const user = await googleLogin(response.credential);
      navigate(user.role === 'ADMIN' ? '/admin' : '/');
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao entrar com o Google');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '250984542079-illms0fgfk1krfkq4ko0i2skftjfd121.apps.googleusercontent.com',
          callback: handleGoogleCallback,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-btn'),
          { theme: 'outline', size: 'large', width: 384, text: 'signin_with' }
        );
      }
    };

    return () => {
      try {
        document.body.removeChild(script);
      } catch (e) {}
    };
  }, [isLogin]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: {
      zipCode: '',
      street: '',
      number: '',
      city: '',
      state: ''
    }
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Dynamic CEP Auto-fill for registration
  const handleCepLookup = async (cep) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            address: {
              ...prev.address,
              street: data.logradouro || '',
              city: data.localidade || '',
              state: data.uf || ''
            }
          }));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const user = await login(formData.email, formData.password);
        navigate(user.role === 'ADMIN' ? '/admin' : '/');
      } else {
        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('address', JSON.stringify(formData.address));
        if (avatar) {
          data.append('avatar', avatar);
        }

        await register(data);
        navigate('/');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Erro na autenticação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background relative overflow-hidden">
      
      {/* PAINEL DA ESQUERDA: Blueprint Técnico (Exibido apenas em Desktop) */}
      <div className="hidden lg:flex flex-col justify-between p-16 bg-blueprint-grid relative overflow-hidden border-r border-outline-variant/30 bg-symbol-watermark">
        <div className="absolute inset-0 radial-blueprint-glow pointer-events-none"></div>
        
        {/* Topo do Painel Esquerdo */}
        <div className="relative z-10 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-xs font-black uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/10 hover-premium">
            <ArrowLeft size={14} /> Voltar ao Início
          </button>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-secondary bg-secondary/10 px-3 py-1 rounded border border-secondary/20">
            E-commerce de Engenharia
          </span>
        </div>

        {/* Centro do Painel Esquerdo */}
        <div className="relative z-10 space-y-8 my-auto">
          <div className="space-y-4">
            <h1 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
              NATAN <span className="text-secondary block mt-1">CONSTRUÇÕES</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed max-w-lg font-medium">
              Do alicerce ao acabamento: conecte-se à plataforma de cotação técnica mais moderna de Sergipe e gerencie seus materiais com agilidade.
            </p>
          </div>

          {/* Cards de Recursos Flutuantes (Visual WOW) */}
          <div className="space-y-4 max-w-md pt-4">
             <div className="flex gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group">
                <div className="w-12 h-12 bg-secondary/20 text-secondary rounded-xl flex items-center justify-center shrink-0 border border-secondary/20 shadow-md">
                   <FileText size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Orçamentos Profissionais em PDF</h4>
                  <p className="text-white/50 text-xs mt-1">Baixe folhas de cotação formatadas para engenheiros e mestres de obra.</p>
                </div>
             </div>

             <div className="flex gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group">
                <div className="w-12 h-12 bg-primary/20 text-white rounded-xl flex items-center justify-center shrink-0 border border-white/20 shadow-md">
                   <Truck size={22} className="text-blue-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Logística de Cargas Pesadas</h4>
                  <p className="text-white/50 text-xs mt-1">Cálculo de cubagem e peso dimensionado por estado de entrega.</p>
                </div>
             </div>

             <div className="flex gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group">
                <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-xl flex items-center justify-center shrink-0 border border-green-500/20 shadow-md">
                   <MessageCircle size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Agendamento pelo WhatsApp</h4>
                  <p className="text-white/50 text-xs mt-1">Fechamento comercial direto e seguro para garantir o melhor preço.</p>
                </div>
             </div>
          </div>
        </div>

        {/* Rodapé do Painel Esquerdo */}
        <div className="relative z-10 text-[10px] text-white/40 uppercase tracking-widest font-bold">
          © 2026 Natan Construções - Nossa Senhora da Glória - SE
        </div>
      </div>

      {/* PAINEL DA DIREITA: Formulário com Visual Glassmorphism */}
      <div className="flex items-center justify-center p-6 bg-blueprint-grid lg:bg-background relative overflow-hidden bg-symbol-watermark">
        <div className="absolute inset-0 radial-blueprint-glow pointer-events-none lg:hidden"></div>
        <div className="absolute inset-0 bg-blueprint-grid opacity-10 pointer-events-none hidden lg:block"></div>

        <Card className="w-full max-w-md relative z-10 shadow-2xl rounded-3xl p-8 hover-premium glass">
          <div className="text-center mb-8">
            <div className="lg:hidden text-2xl font-black text-primary uppercase italic tracking-tighter mb-2">
              NATAN <span className="text-secondary">CONSTRUÇÕES</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-primary uppercase tracking-tighter italic leading-none">
              {isLogin ? 'Bem-vindo!' : 'Crie sua Conta'}
            </h2>
            <p className="text-outline text-xs mt-2 font-bold uppercase tracking-wider">
              {isLogin ? 'Faça login para gerenciar sua obra' : 'Preencha os dados de entrega para cadastro'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="flex flex-col items-center gap-4 mb-6 pt-2">
                 <div className="relative group">
                    <div className="w-20 h-20 rounded-2xl border-2 border-primary/20 bg-surface-container overflow-hidden relative shadow-md">
                      {avatarPreview ? (
                         <img src={avatarPreview} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                         <div className="w-full h-full flex items-center justify-center text-outline text-[10px] text-center p-2 font-black uppercase italic tracking-tighter">
                            FOTO<br/>OPCIONAL
                         </div>
                      )}
                    </div>
                    <label className="absolute -bottom-1 -right-1 bg-secondary text-white p-2 rounded-xl cursor-pointer shadow-lg hover:scale-110 transition-transform">
                       <UserPlus size={14} />
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
              </div>
            )}

            {!isLogin && (
              <Input 
                label="Nome Completo" 
                placeholder="Ex: João da Silva" 
                required 
                maxLength={50}
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            )}

            <Input 
              label="E-mail" 
              type="email" 
              placeholder="seu@email.com" 
              required
              maxLength={100}
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
            
            <Input 
              label="Senha" 
              type="password" 
              placeholder="••••••••" 
              required 
              maxLength={20}
              minLength={6}
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />

            {!isLogin && (
              <div className="space-y-4 pt-2 border-t border-outline-variant/60">
                <p className="text-[10px] font-black text-outline uppercase tracking-wider">Endereço de Obra / Entrega</p>
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="CEP (Consulta Automática)" 
                    placeholder="00000-000" 
                    maxLength={9}
                    value={formData.address.zipCode}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '').substring(0, 8);
                      const formatted = val.length > 5 ? `${val.substring(0, 5)}-${val.substring(5)}` : val;
                      setFormData({...formData, address: {...formData.address, zipCode: formatted}});
                      handleCepLookup(formatted);
                    }}
                  />
                  <Input 
                    label="Número" 
                    placeholder="123" 
                    maxLength={10}
                    value={formData.address.number}
                    onChange={e => setFormData({...formData, address: {...formData.address, number: e.target.value}})}
                  />
                  <div className="col-span-2">
                    <Input 
                      label="Rua" 
                      placeholder="Preenchido automaticamente ao digitar o CEP" 
                      maxLength={100}
                      value={formData.address.street}
                      onChange={e => setFormData({...formData, address: {...formData.address, street: e.target.value}})}
                    />
                  </div>
                </div>
              </div>
            )}

            <Button className="w-full mt-6 h-14 uppercase font-black tracking-widest italic" disabled={loading}>
              {loading ? 'Processando...' : isLogin ? <><LogIn className="mr-2 w-5 h-5" /> Entrar</> : <><UserPlus className="mr-2 w-5 h-5" /> Cadastrar</>}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest"><span className="bg-surface px-2 text-outline">Ou continue com</span></div>
            </div>

            <div id="google-signin-btn" className="w-full flex justify-center mt-2"></div>
          </form>

          <p className="text-center mt-6 text-xs text-outline font-bold">
            {isLogin ? 'Novo por aqui?' : 'Já possui conta?'}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-primary font-black ml-1 hover:underline uppercase tracking-wide"
            >
              {isLogin ? 'Crie sua conta' : 'Faça login'}
            </button>
          </p>
        </Card>
      </div>
    </div>
  );
}
