"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, ShieldCheck, Ticket, Users } from "lucide-react";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <div className="min-h-screen bg-canvas text-fg overflow-hidden flex flex-col font-sans selection:bg-brand-soft">
      {/* Background Animated Nebulas */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand/20 blur-[120px] rounded-full mix-blend-screen animate-nebula-drift-a" />
        <div className="absolute top-[40%] right-[-20%] w-[60%] h-[60%] bg-accent/10 blur-[150px] rounded-full mix-blend-screen animate-nebula-drift-b" />
      </div>

      {/* Navbar */}
      <header className="relative z-10 w-full border-b border-line bg-canvas/60 backdrop-blur-md">
        <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/20 border border-brand/30">
              <Ticket className="h-4 w-4 text-brand-glow" />
            </div>
            <span className="font-bold tracking-tight text-lg text-ink-900">Ticket Matrix</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-md bg-brand px-5 py-2 text-sm font-medium text-white shadow-brand transition-all hover:bg-brand/90 hover:shadow-[0_0_30px_rgba(77,107,254,0.7)]"
            >
              Enter Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full pt-28 pb-20 md:pt-40 md:pb-32 px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="container mx-auto max-w-5xl flex flex-col items-center text-center"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center rounded-full border border-brand-soft bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand-glow mb-8 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-brand-glow mr-2 animate-pulse" />
              Nativetalk Enterprise Operations
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 max-w-4xl text-balance leading-[1.1]">
              Enterprise Support Operations, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-glow to-brand">Unified.</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-fg-muted mb-12 max-w-2xl text-balance leading-relaxed">
              Architected for scale. Manage agent assignments, track customer inquiries, and surface real-time completion metrics in a single, high-performance operator view.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
              <Link
                href="/dashboard"
                className="inline-flex h-14 items-center justify-center rounded-lg bg-brand px-8 text-base font-medium text-white shadow-brand transition-all hover:bg-brand/90 hover:scale-105 active:scale-95"
              >
                Launch Platform <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="https://github.com/i-MMANTECH/Ticket-Matrix"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-14 items-center justify-center rounded-lg bg-surface border border-line px-8 text-base font-medium text-fg shadow-soft transition-all hover:bg-surface/80 hover:text-brand-glow"
              >
                View Source
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="w-full py-24 bg-bg-soft border-t border-line backdrop-blur-sm">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-ink-900">Engineered for Velocity</h2>
              <p className="text-fg-subtle text-lg max-w-2xl mx-auto">A modern stack designed to eliminate friction in enterprise support operations.</p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <motion.div variants={itemVariants} className="flex flex-col gap-5 p-8 rounded-2xl bg-surface border border-line shadow-card hover:border-brand-soft/50 transition-colors group">
                <div className="h-14 w-14 rounded-xl bg-tile-blue flex items-center justify-center text-brand-glow group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-semibold text-ink-900">Role-Based Access</h3>
                <p className="text-fg-muted leading-relaxed">Built around strict typed API contracts and robust RBAC, ensuring operators and agents only access authorized infrastructure.</p>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col gap-5 p-8 rounded-2xl bg-surface border border-line shadow-card hover:border-brand-soft/50 transition-colors group">
                <div className="h-14 w-14 rounded-xl bg-tile-green flex items-center justify-center text-status-doneFg group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-semibold text-ink-900">Real-Time Metrics</h3>
                <p className="text-fg-muted leading-relaxed">Surface completion-rate metrics instantly. A centralized view that gives operators immediate insight into support velocity.</p>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col gap-5 p-8 rounded-2xl bg-surface border border-line shadow-card hover:border-brand-soft/50 transition-colors group">
                <div className="h-14 w-14 rounded-xl bg-tile-purple flex items-center justify-center text-[#c4b5fd] group-hover:scale-110 transition-transform">
                  <Users className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-semibold text-ink-900">Agent Routing</h3>
                <p className="text-fg-muted leading-relaxed">Seamlessly manage agent assignments and distribute customer inquiries to prevent bottlenecks and ensure SLA compliance.</p>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col gap-5 p-8 rounded-2xl bg-surface border border-line shadow-card hover:border-brand-soft/50 transition-colors group">
                <div className="h-14 w-14 rounded-xl bg-tile-red flex items-center justify-center text-status-highFg group-hover:scale-110 transition-transform">
                  <Ticket className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-semibold text-ink-900">Centralized Command</h3>
                <p className="text-fg-muted leading-relaxed">A single, unified operator dashboard that replaces fragmented tooling, built on Next.js with deep Framer Motion integrations.</p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-line py-10 bg-canvas">
        <div className="container mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-fg-subtle">
            © {new Date().getFullYear()} Geod Talk · Ticketing. Architected by Emmanuel Aro.
          </p>
          <div className="flex gap-6 text-sm font-mono text-fg-subtle">
            <span>Next.js 15</span>
            <span>TypeScript</span>
            <span>Tailwind</span>
            <span>Framer Motion</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
