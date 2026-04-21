"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BrainCircuit, ShieldCheck, Target, Zap } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-black/5">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Operon AI" width={32} height={32} />
          <span className="text-xl font-black tracking-tighter">OPERON AI</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-bold hover:opacity-60 transition-opacity">Login</Link>
          <Link href="/dashboard">
            <Button className="bg-black text-white hover:bg-black/90 rounded-full px-6 font-bold h-10">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="px-8 pt-24 pb-16 text-center space-y-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-4 py-1.5 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6 inline-block">
              Autonomous Agent Hive
            </span>
            <h1 className="text-7xl md:text-8xl font-black tracking-tighter leading-[0.9] text-black">
              Digital Twin of Corporate Logic.
            </h1>
            <p className="text-xl text-black/60 mt-8 max-w-2xl mx-auto font-medium">
              Synchronize live data with internal policy manuals. Simulate future outcomes with verifiable, explainable AI decisions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
          >
            <Link href="/dashboard">
              <Button className="bg-black text-white hover:bg-black/90 h-14 px-10 rounded-full font-black text-lg group">
                Enter the Hive
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="outline" className="border-black h-14 px-10 rounded-full font-black text-lg">
              View Documentation
            </Button>
          </motion.div>
        </section>

        {/* Feature Grid */}
        <section className="px-8 py-24 bg-[#F9F9F9] border-y border-black/5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Data Analyst", icon: Target, desc: "Automated EDA and anomaly detection on live streams." },
              { title: "Policy Guardian", icon: ShieldCheck, desc: "Vector-indexed RAG for verifiable governance compliance." },
              { title: "Simulation Strategist", icon: Zap, desc: "Monte Carlo 'What-If' simulations for risk assessment." },
              { title: "Executive Brain", icon: BrainCircuit, desc: "Groq-powered synthesis for explainable leadership advice." },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + (i * 0.1) }}
                className="p-8 bg-white border border-black/5 rounded-3xl hover:border-black/20 transition-colors group"
              >
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-black tracking-tighter mb-3">{feature.title}</h3>
                <p className="text-sm text-black/60 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Branding Quote */}
        <section className="px-8 py-32 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-black mb-8 italic">
              "AI shouldn't be a black box. It should be an explainable chain of thought."
            </h2>
            <div className="flex items-center justify-center gap-4 text-black/40 font-bold uppercase tracking-widest text-xs">
              <div className="h-px w-8 bg-black/10" />
              Operon AI Core Principles
              <div className="h-px w-8 bg-black/10" />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-8 py-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Operon AI" width={24} height={24} />
          <span className="text-sm font-black tracking-tighter">© 2026 OPERON AI</span>
        </div>
        <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-black/40">
          <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-black transition-colors">Enterprise API</a>
        </div>
      </footer>
    </div>
  );
}
