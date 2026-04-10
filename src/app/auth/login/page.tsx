'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Hospital, 
  Mail, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/firebase';
import { 
  signInWithEmailAndPassword, 
  setPersistence, 
  browserLocalPersistence 
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsLoading(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Authentification réussie', description: 'Connexion au terminal de gestion en cours...' });
      router.push('/dashboard');
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Échec de connexion',
        description: 'Vérifiez vos identifiants ou contactez l\'administrateur IT.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 selection:bg-primary/20">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-10 border border-white/20 dark:border-white/5 shadow-2xl overflow-hidden relative">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-10">
            <motion.div 
               initial={{ rotate: -10 }}
               animate={{ rotate: 0 }}
               className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/20 mb-4"
            >
              <Hospital className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-black tracking-tighter">MDCD <span className="text-primary">HMS</span></h1>
            <p className="text-muted-foreground text-[13px] font-medium uppercase tracking-widest mt-1">Terminal de Contrôle</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-tight ml-1 text-muted-foreground">Adresse E-mail</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input 
                    id="email"
                    type="email"
                    placeholder="nom@mdcd.hospital"
                    className="pl-10 h-10 bg-background/50 focus:ring-primary border-border/60"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <Label htmlFor="password" className="text-xs font-bold uppercase tracking-tight text-muted-foreground">Mot de passe</Label>
                  <Button variant="link" className="h-auto p-0 text-[10px] text-muted-foreground hover:text-primary">Oublié ?</Button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input 
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-10 bg-background/50 focus:ring-primary border-border/60"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 software-btn text-base font-bold shadow-xl shadow-primary/10 group"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Initialisation...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Accéder au système
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              )}
            </Button>
          </form>

          {/* Security Footer */}
          <div className="mt-10 pt-6 border-t border-border/40 flex items-center justify-center gap-2 text-[11px] text-muted-foreground font-medium grayscale opacity-60">
            <ShieldCheck className="w-4 h-4" />
            Environnement Sécurisé & Chiffré AES-256
          </div>
        </div>

        {/* Brand Footer */}
        <p className="text-center mt-8 text-xs text-muted-foreground uppercase font-black tracking-widest opacity-30">
          Polyclinique MDCD — Système de Gestion Hospitalière
        </p>
      </motion.div>
    </div>
  );
}
