import React, { useState } from 'react';
import { Button, Input, Card } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Eye, EyeOff, Mail, Lock, User as UserIcon, Camera, MapPin, Hash } from 'lucide-react';
import useSEO from '../hooks/useSEO';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);

  useSEO({ 
    title: isLogin ? "Entrar" : "Criar Conta", 
    description: "Acesse sua conta na Natan Construções para gerenciar seus pedidos e aproveitar ofertas exclusivas." 
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const user = await login(formData.email, formData.password);
        navigate(user.role === 'ADMIN' ? '/admin' : '/');
      } else {
        // Enviar como FormData para suportar arquivo
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-background blueprint-bg relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        {/* Grid do Blueprint */}
        <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #00345f 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      </div>

      <Card className="w-full max-w-md relative z-10 glass">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-primary uppercase tracking-tighter italic">Natan Construções</h1>
          <p className="text-outline text-sm mt-2">{isLogin ? 'Bem-vindo de volta, profissional' : 'Crie sua conta para começar sua obra'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="flex flex-col items-center gap-4 mb-6 pt-2">
               <div className="relative group">
                  <div className="w-24 h-24 rounded-full border-4 border-primary/20 bg-surface-container overflow-hidden relative">
                    {avatarPreview ? (
                       <img src={avatarPreview} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                       <div className="w-full h-full flex items-center justify-center text-outline text-xs text-center p-2 font-bold uppercase italic tracking-tighter">
                          Foto<br/>Opcional
                       </div>
                    )}
                  </div>
                  <label className="absolute -bottom-1 -right-1 bg-primary text-white p-2 rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform">
                     <UserPlus size={16} />
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
               <p className="text-[10px] text-outline font-black uppercase tracking-widest italic">Personalize seu perfil</p>
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
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="CEP" 
                placeholder="00000-000" 
                maxLength={9}
                value={formData.address.zipCode}
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '').substring(0, 8);
                  // Opcional: formatar como 00000-000
                  const formatted = val.length > 5 ? `${val.substring(0, 5)}-${val.substring(5)}` : val;
                  setFormData({...formData, address: {...formData.address, zipCode: formatted}});
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
                  placeholder="Nome da avenida ou rua" 
                  maxLength={100}
                  value={formData.address.street}
                  onChange={e => setFormData({...formData, address: {...formData.address, street: e.target.value}})}
                />
              </div>
            </div>
          )}

          <Button className="w-full mt-4 h-14" disabled={loading}>
            {loading ? 'Processando...' : isLogin ? <><LogIn className="mr-2 w-5 h-5" /> Entrar</> : <><UserPlus className="mr-2 w-5 h-5" /> Cadastrar</>}
          </Button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-outline">Ou continue com</span></div>
          </div>

          <Button variant="outline" className="w-full h-12 flex items-center justify-center gap-3">
            <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-5 h-5" alt="Google" />
            Entrar com Google
          </Button>
        </form>

        <p className="text-center mt-6 text-sm text-outline">
          {isLogin ? 'Novo por aqui?' : 'Já possui conta?'}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-primary font-bold ml-1 hover:underline"
          >
            {isLogin ? 'Crie sua conta' : 'Faça login'}
          </button>
        </p>
      </Card>
    </div>
  );
}
