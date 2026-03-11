'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, Zap, Settings, BarChart3, Sparkles, Shield, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-x-hidden">
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_hsl(var(--primary)/0.05)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_hsl(var(--primary)/0.02)_0%,_transparent_40%)]" />
        <div className="absolute inset-0 opacity-10 dark:opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 lg:py-32">
        {/* Hero Section */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="text-center mb-32"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-8">
            <Sparkles className="w-3 h-3" />
            Next-Gen Form Engine
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-6xl lg:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-b from-foreground via-foreground to-foreground/40 bg-clip-text text-transparent"
          >
            Humanity <br className="hidden md:block" />
            <span className="text-primary italic">Engineered.</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
          >
            Deploy mission-critical safety forms with deterministic logic,
            version-controlled schemas, and instant schema validation.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/console/builder">
              <Button size="lg" className="h-14 px-8 text-base font-bold gap-3 bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-[0_0_20px_rgba(var(--primary),0.15)] rounded-full">
                Build Prototype <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/console/admin">
              <Button size="lg" variant="outline" className="h-14 px-8 text-base font-bold bg-muted/50 border-border backdrop-blur-md hover:bg-muted transition-all rounded-full">
                Forms Management
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-40"
        >
          {[
            {
              icon: <Cpu className="w-10 h-10 text-primary" />,
              title: "Logic Engine",
              desc: "Pure-function evaluation system for complex conditional workflows and field relationships."
            },
            {
              icon: <Settings className="w-10 h-10 text-primary" />,
              title: "Version Control",
              desc: "Immutable form snapshots with parent-child branching and full historical traceability."
            },
            {
              icon: <BarChart3 className="w-10 h-10 text-primary" />,
              title: "Data Integrity",
              desc: "High-fidelity submission ingestion with structured JSONB storage and atomic commit validation."
            }
          ].map((feature, i) => (
            <motion.div key={i} variants={fadeInUp}>
              <Card className="bg-card border-border backdrop-blur-xl hover:bg-accent/5 transition-all hover:-translate-y-2 group h-full shadow-sm hover:shadow-md">
                <CardHeader className="p-8">
                  <div className="mb-6 p-3 bg-muted w-fit rounded-2xl group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground mb-3">{feature.title}</CardTitle>
                  <CardDescription className="text-muted-foreground text-base leading-relaxed">
                    {feature.desc}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Cinematic Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative rounded-[3rem] overflow-hidden border border-border bg-gradient-to-br from-muted/50 to-transparent p-12 lg:p-20 mb-20 shadow-lg"
        >
          <div className="absolute top-0 right-0 p-8 text-zinc-800 pointer-events-none select-none">
            <Shield className="w-64 h-64 opacity-5 translate-x-32 -translate-y-32" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                Safety without <br />
                <span className="text-primary italic">Compromise.</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our architecture separates form definition from runtime execution,
                enabling zero-latency field transitions and server-side validation
                guarantees that withstand the most demanding enterprise requirements.
              </p>
              <div className="flex gap-10">
                <div>
                  <div className="text-3xl font-bold text-foreground mb-1">99.9%</div>
                  <div className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Logic Accuracy</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-foreground mb-1">&lt;50ms</div>
                  <div className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Logic Latency</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-muted rounded-3xl border border-border flex items-center justify-center">
                <Shield className="w-12 h-12 text-primary/50" />
              </div>
              <div className="aspect-square bg-primary/10 rounded-3xl border border-primary/20 flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-primary" />
              </div>
              <div className="aspect-square bg-muted rounded-3xl border border-border flex items-center justify-center">
                <Cpu className="w-12 h-12 text-muted-foreground/20" />
              </div>
              <div className="aspect-square bg-muted rounded-3xl border border-border flex items-center justify-center">
                <Settings className="w-12 h-12 text-muted-foreground/20" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="text-center py-20 border-t border-white/5">
          <p className="text-zinc-600 text-sm font-medium">
            © 2026 humanity_Founders Operating System. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}

