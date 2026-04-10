'use client';

import { motion } from 'framer-motion';
import { 
  Hospital, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  FlaskConical, 
  Pill, 
  LineChart,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const features = [
  {
    title: "Admissions & Accueil",
    description: "Gestion intelligente des flux patients et triage rapide.",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Intelligence Médicale",
    description: "Dossier patient consolidé et suivi des constantes vitales.",
    icon: Activity,
    color: "text-red-500",
    bg: "bg-red-500/10"
  },
  {
    title: "Pharmacie Avancée",
    description: "Gestion permanente des stocks et dispensation sécurisée.",
    icon: Pill,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    title: "Plateau Technique",
    description: "Analyses de laboratoire et archivage numérique des résultats.",
    icon: FlaskConical,
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  {
    title: "Finance & Reporting",
    description: "Facturation automatisée et analytique financière précise.",
    icon: LineChart,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10"
  },
  {
    title: "Sécurité de Données",
    description: "Cloud-first architecture pour une haute disponibilité et performance.",
    icon: ShieldCheck,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <nav className="fixed top-0 w-full z-50 glass border-b px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary rounded-lg">
            <Hospital className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">MDCD <span className="text-primary">HMS</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/login">
            <Button variant="ghost" className="text-sm font-medium h-9">Connexion</Button>
          </Link>
          <Link href="/auth/login">
            <Button className="software-btn h-9 gap-2">
              Commencer
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/10 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              L'excellence hospitalière numérique
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-[1.1]">
              Pilotez votre hôpital avec <br />
              <span className="text-gradient">Intelligence et Précision.</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              La plateforme MDCD intègre tous les aspects de la gestion médicale et administrative dans une interface fluide, compacte et ultra-performance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/login">
                <Button className="h-12 px-8 text-base font-bold gap-2 shadow-xl shadow-primary/20">
                  Lancer le logiciel
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" className="h-12 px-8 text-base font-medium">
                Découvrir les fonctionnalités
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="group"
            >
              <div className="premium-card p-6 h-full flex flex-col items-start gap-4 rounded-2xl">
                <div className={`p-3 rounded-xl ${feature.bg} transition-transform group-hover:scale-110 duration-300`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Info Banner */}
        <section className="mt-24">
          <div className="glass-card p-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold mb-4">Une architecture cloud moderne pour une stabilité absolue.</h2>
              <p className="text-muted-foreground leading-relaxed italic">
                "Nous utilisons la puissance de Firebase pour vous offrir une réactivité temps-réel et une fiabilité exceptionnelle dans la gestion de vos données."
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="text-center p-6 bg-background/50 rounded-2xl border">
                  <p className="text-3xl font-black text-primary">0%</p>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1">Latence Locale</p>
               </div>
               <div className="text-center p-6 bg-background/50 rounded-2xl border">
                  <p className="text-3xl font-black text-primary">100%</p>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1">Offline First</p>
               </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 grayscale opacity-50">
            <Hospital className="w-5 h-5" />
            <span className="font-bold text-sm">MDCD HOSPITAL MANAGEMENT SYSTEM</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Polyclinique MDCD. Propulsé par Next.js & Antigravity Intelligence.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}>
            {children}
        </span>
    );
}
