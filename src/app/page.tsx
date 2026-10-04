"use client";

import React, { useState } from "react";
import { submitContactMessage } from "@/actions/contact";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  ArrowRight, Activity, Globe, Shield, Zap, Users, Award,
  Mail, MapPin, ExternalLink, Lightbulb, Trophy, BookOpen, Network, Settings, Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
  </svg>
);

function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setErrorMsg("Veuillez remplir les champs obligatoires.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    const res = await submitContactMessage(form);
    if (res.error) {
      setErrorMsg(res.error);
      setStatus("error");
    } else {
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <section className="relative py-24 bg-black px-6" id="contact-form">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-black mb-4">Contactez-nous</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Vous avez une question, une proposition de partenariat ou vous souhaitez simplement nous dire bonjour ? Laissez-nous un message !</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* ── Developer Contact Card ── */}
          <div className="space-y-6">
            {/* Profile card */}
            <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-8 backdrop-blur-xl overflow-hidden group hover:border-cyan-500/30 transition-all duration-500">
              {/* Glow */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-all duration-700" />

              {/* Header */}
              <div className="flex items-center gap-5 mb-8 relative z-10">
                <div className="relative">
                  <div className="h-20 w-20 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)] overflow-hidden border border-cyan-500/30 bg-white/5">
                    <img src="/feres.jpg" alt="Feres Fatmi" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-400 rounded-full border-2 border-black" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Feres Fatmi</h3>
                  <p className="text-cyan-400 font-semibold text-sm leading-tight mt-0.5">Business Analyst</p>
                  <p className="text-cyan-400 font-semibold text-sm">& Media Supervisor</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="h-1.5 w-1.5 bg-cyan-400 rounded-full animate-pulse" />
                    <span className="text-xs text-gray-400">Cisco Club Esprit</span>
                  </div>
                </div>
              </div>

              {/* Contact details */}
              <div className="space-y-4 relative z-10">
                <a href="tel:+21696973479" className="flex items-center gap-4 group/item hover:bg-white/5 p-3 rounded-xl transition-all duration-200 -mx-3">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 group-hover/item:bg-cyan-500/20 transition-colors">
                    <Phone className="h-4.5 w-4.5 text-cyan-400 h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Téléphone</p>
                    <p className="text-white font-semibold">+216 96 973 479</p>
                  </div>
                </a>

                <a href="mailto:feresfatmi07@gmail.com" className="flex items-center gap-4 group/item hover:bg-white/5 p-3 rounded-xl transition-all duration-200 -mx-3">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 group-hover/item:bg-cyan-500/20 transition-colors">
                    <Mail className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Email</p>
                    <p className="text-white font-semibold">feresfatmi07@gmail.com</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-3 -mx-3">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Adresse</p>
                    <p className="text-white font-semibold">Ariana, Tunis</p>
                  </div>
                </div>

                <a href="https://linkedin.com/in/feresfatmi" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group/item hover:bg-white/5 p-3 rounded-xl transition-all duration-200 -mx-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center shrink-0 group-hover/item:bg-blue-600/20 transition-colors">
                    <ExternalLink className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">LinkedIn</p>
                    <p className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">linkedin.com/in/feresfatmi</p>
                  </div>
                </a>
              </div>

              {/* Bottom CTA */}
              <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
                <p className="text-xs text-gray-500 text-center">
                  Développé avec ❤️ pour <span className="text-cyan-400 font-semibold">Cisco Club Esprit</span>
                </p>
              </div>
            </div>
          </div>

          {/* ── Contact Form ── */}
          <form onSubmit={handleSubmit} className="space-y-6 bg-white/[0.02] border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-300 font-medium">Nom complet *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                  placeholder="Ex: Ahmed Ben Ali" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300 font-medium">Email *</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                  placeholder="ahmed@example.com" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">Sujet</label>
              <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                className="w-full h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
                placeholder="Objet de votre message" />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300 font-medium">Message *</label>
              <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={6}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 resize-none"
                placeholder="Comment pouvons-nous vous aider ?" />
            </div>

            {status === "error" && <p className="text-red-400 text-sm bg-red-500/10 p-3 rounded-xl border border-red-500/20">{errorMsg}</p>}
            {status === "success" && <p className="text-green-400 text-sm bg-green-500/10 p-3 rounded-xl border border-green-500/20">Votre message a été envoyé avec succès ! Nous vous répondrons bientôt.</p>}

            <button type="submit" disabled={status === "loading"}
              className="w-full h-12 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors disabled:opacity-50 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]">
              {status === "loading" ? "Envoi en cours..." : "Envoyer le message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { data: session } = useSession();
  const isAdmin = ["ADMIN","PRESIDENT","VICE_PRESIDENT","SECRETAIRE_GENERAL","RH","TRESORIER_SPONSORING","RESPONSABLE_CELLULE"].includes((session?.user as any)?.role ?? "");

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
  };
  const itemFadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
  };

  const sponsors = [
    { name: "Cisco Systems", logoUrl: "/sponsors/sponsor2.jfif", tier: "Platinum", color: "#00BCEB", description: "Partenaire technologique mondial - fournit equipements, certifications et ressources pedagogiques au club." },
    { name: "NVIDIA", logoUrl: "/sponsors/sponsor3.png", tier: "Gold", color: "#76B900", description: "Leader mondial en IA et calcul visuel - sponsorise nos hackathons et defis d'innovation." },
    { name: "Yakdhane", logoUrl: "/sponsors/sponsor1.png", tier: "Silver", color: "#002D72", description: "Partenaire strategique pour nos evenements et formations." },
    { name: "ESPRIT", logoUrl: "/sponsors/sponsor4.jfif", tier: "Bronze", color: "#E60000", description: "Notre universite d'attache - soutient notre mission de connectivite et d'innovation continue." },
  ];

  const activities = [
    { icon: <Network className="h-7 w-7" />, title: "Networking Bootcamps", desc: "Sessions CCNA/CCNP intensives avec equipements Cisco reels, simulations et formateurs certifies CCIE." },
    { icon: <Shield className="h-7 w-7" />, title: "Cybersecurity Challenges", desc: "Competitions Capture The Flag (CTF), ateliers ethical hacking et campagnes de sensibilisation." },
    { icon: <Lightbulb className="h-7 w-7" />, title: "Innovation Hackathons", desc: "Hackathons de 24h pour concevoir des solutions tech creatives avec mentorship d'experts industriels." },
    { icon: <BookOpen className="h-7 w-7" />, title: "Ateliers Techniques", desc: "Hands-on sur Wireshark, Packet Tracer, Cloud Computing, IoT et SD-WAN." },
    { icon: <Globe className="h-7 w-7" />, title: "Conferences Industrie", desc: "Tables rondes avec des ingenieurs Cisco et professionnels de l'industrie tunisienne et internationale." },
    { icon: <Trophy className="h-7 w-7" />, title: "Competitions & Prix", desc: "Participation a NetRiders, CyberOps et competitions regionales representant ESPRIT au niveau national." },
    { icon: <Users className="h-7 w-7" />, title: "Community Building", desc: "Evenements sociaux, team-building et initiatives communautaires pour renforcer l'esprit d'equipe." },
    { icon: <Award className="h-7 w-7" />, title: "Certifications Cisco", desc: "Preparation guidee aux certifications CCNA, CyberOps Associate et DevNet Associate." },
  ];

  const board = [
    { file: "830937011_1726866381759377_580913927035532552_n.png", role: "Presidente" },
    { file: "833573074_1054903407537704_5746676480335104443_n.png", role: "Vice-President" },
    { file: "faten_karou.png", role: "Treasurer" },
    { file: "829554237_1576705584196636_704206360650357138_n.png", role: "HR Manager" },
    { file: "825258993_2098424957703198_1660312889605545020_n.png", role: "Event Manager" },
    { file: "828304704_2449853345539469_1878577320317306014_n.png", role: "Event Manager Assistant" },
    { file: "825258995_28946344038317166_4467828120629504236_n.png", role: "Logistics Manager" },
    { file: "830056050_2658834327934008_3914826303594024668_n.png", role: "Media Supervisor" },
    { file: "829016119_1138385788618005_2140265998578352284_n.png", role: "Media Manager" },
    { file: "825308080_1090901603659220_5551465799695238945_n.png", role: "Media Manager Assistant" },
    { file: "825256751_1392173389793399_4447884036438255330_n.png", role: "Sponsorship Manager Assistant" },
  ];

  return (
    <div className="relative w-full bg-black text-white overflow-hidden font-sans">

      {/* ── HERO ────────────────────────────────── */}
      <section className="relative min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/65 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/70 z-10" />
          <video autoPlay loop muted playsInline className="object-cover w-full h-full opacity-60">
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0 z-10 opacity-10"
          style={{ backgroundImage: "linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" as const }}
          className="relative z-20 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto"
        >
          <div className="flex items-center gap-2">
            <img
              src="/cisco-logo.jpg"
              alt="Cisco Club ESPRIT"
              className="h-14 w-14 rounded-full object-cover shadow-[0_0_20px_rgba(6,182,212,0.3)] border border-cyan-500/30"
            />
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
            <Link href="#about" className="hover:text-cyan-400 transition-colors">A Propos</Link>
            <Link href="#activities" className="hover:text-cyan-400 transition-colors">Activites</Link>
            <Link href="#sponsors" className="hover:text-cyan-400 transition-colors">Sponsors</Link>
            <Link href="/events" className="hover:text-cyan-400 transition-colors">Evenements</Link>
            <Link href="/recrutement" className="hover:text-cyan-400 transition-colors font-semibold text-cyan-300">Recrutement</Link>
            <Link href="#contact" className="hover:text-cyan-400 transition-colors">Contact</Link>
          </div>
          {session?.user ? (
            <Button asChild variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 bg-transparent rounded-full px-6">
              <Link href={isAdmin ? "/admin" : "/admin/profile"}>
                {isAdmin ? "Espace Admin" : "Mon Espace"}
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 bg-transparent rounded-full px-6">
              <Link href="/auth/login">Accès Portail</Link>
            </Button>
          )}
        </motion.nav>

        <main className="relative z-20 flex flex-col items-center justify-center min-h-[calc(100vh-90px)] px-6 text-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="max-w-5xl mx-auto">
            <motion.div variants={itemFadeUp} className="mb-6 flex justify-center">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                Cisco Networking Academy Partner - ESPRIT
              </span>
            </motion.div>
            <motion.h1 variants={itemFadeUp}
              className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-400"
            >
              Build. Secure.<br className="hidden md:block" /> Connect.
            </motion.h1>
            <motion.p variants={itemFadeUp} className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed">
              Le <span className="text-cyan-400 font-semibold">Cisco Club ESPRIT</span> forme les ingenieurs reseau de demain a travers des bootcamps, hackathons et certifications de niveau professionnel.
            </motion.p>
            <motion.div variants={itemFadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 md:mt-10">
              <Link href="/events"
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-cyan-500 text-black hover:bg-cyan-400 hover:scale-105 transition-all shadow-[0_0_30px_rgba(6,182,212,0.5)] text-sm md:text-base px-8 md:px-10 h-12 md:h-14 font-bold">
                Explorer les Evenements <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Link>
              <Link href="#about"
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10 bg-black/20 backdrop-blur-md text-sm md:text-base px-8 md:px-10 h-12 md:h-14">
                Decouvrir le Club
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="mt-12 md:mt-0 md:absolute md:bottom-10 left-1/2 md:-translate-x-1/2 flex flex-wrap justify-center gap-6 md:gap-16 w-full px-4"
          >
            {[["150+", "Membres Actifs"], ["20+", "Evenements/An"], ["4", "Sponsors Officiels"], ["5", "Cellules"]].map(([num, label]) => (
              <div key={label} className="text-center min-w-[100px]">
                <div className="text-2xl md:text-3xl font-bold text-white">{num}</div>
                <div className="text-[10px] md:text-xs text-cyan-400 mt-1 font-medium uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </motion.div>
        </main>
      </section>

      {/* ── ABOUT ────────────────────────────────── */}
      <section id="about" className="relative py-28 px-6 bg-black overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-medium">
              <Activity className="h-4 w-4" /> A Propos du Club
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              La <span className="text-cyan-400">Reference</span> en<br />Reseau & Cybersecurite<br />a ESPRIT
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Fonde sous l&apos;egide de la <strong className="text-white">Cisco Networking Academy</strong>, le Cisco Club ESPRIT rassemble les etudiants passionnes par les technologies reseau, la cybersecurite et le cloud computing.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Notre mission : transformer les etudiants ESPRIT en professionnels certifies prets a relever les defis de l&apos;industrie. Grace a des partenariats avec des leaders mondiaux comme Cisco Systems, nous offrons un acces direct aux meilleures ressources et certifications.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[["150+", "Membres Actifs", "text-cyan-400"], ["20+", "Evenements/An", "text-purple-400"], ["100%", "Engagement", "text-green-400"]].map(([num, label, color]) => (
                <div key={label} className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className={`text-3xl font-bold ${color}`}>{num}</div>
                  <div className="text-xs text-gray-400 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
            <div className="absolute -inset-4 bg-cyan-500/10 rounded-3xl blur-2xl" />
            <div className="relative rounded-2xl overflow-hidden border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
              <img src="/team.webp" alt="Cisco Club ESPRIT Team" className="w-full h-auto object-cover" />
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="text-white font-semibold text-lg">L&apos;equipe Cisco Club ESPRIT</span>
                <p className="text-cyan-400 text-sm">Secure & Green Campus Hackathon</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── ACTIVITIES ────────────────────────────── */}
      <section id="activities" className="relative py-28 px-6 bg-gradient-to-b from-black via-[#040d10] to-black overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-sm font-medium mb-6">
              <Zap className="h-4 w-4" /> Nos Activites
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mb-4">
              Ce Que Nous <span className="text-cyan-400">Faisons</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="text-gray-400 max-w-2xl mx-auto">
              Du reseau au cloud, de la cybersecurite a l&apos;innovation - nous couvrons tout l&apos;ecosysteme tech pour preparer nos membres.
            </motion.p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {activities.map((act, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 hover:border-cyan-500/40 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="h-14 w-14 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 transition-transform duration-300">
                    {act.icon}
                  </div>
                  <h3 className="font-bold text-lg text-white mb-2">{act.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{act.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPONSORS ────────────────────────────── */}
      <section id="sponsors" className="relative py-28 px-6 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-black to-black pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-medium mb-6">
              <Award className="h-4 w-4" /> Nos Partenaires
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mb-4">
              Nos <span className="text-amber-400">Sponsors</span> Officiels
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="text-gray-400 max-w-2xl mx-auto">
              Des partenariats strategiques avec des leaders de l&apos;industrie pour offrir des experiences uniques a nos membres.
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sponsors.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md p-8 hover:border-white/25 transition-all">
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-15 group-hover:opacity-25 transition-opacity" style={{ backgroundColor: s.color }} />
                <div className="flex items-start gap-6">
                  <div className="h-20 w-20 rounded-xl bg-white flex items-center justify-center p-2 shrink-0 overflow-hidden"
                    style={{ border: `2px solid ${s.color}60` }}>
                    <img src={s.logoUrl} alt={s.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-bold text-xl text-white">{s.name}</h3>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                        style={{ color: s.color, backgroundColor: s.color + "20", border: `1px solid ${s.color}40` }}>
                        {s.tier}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{s.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mt-10 p-8 rounded-2xl border border-dashed border-white/20 bg-white/5">
            <p className="text-gray-300 text-lg font-medium">Interesse a sponsoriser le Cisco Club ESPRIT ?</p>
            <p className="text-gray-500 text-sm mt-2 mb-6">Rejoignez nos partenaires et contribuez a l&apos;avenir des ingenieurs tunisiens.</p>
            <a href="mailto:cisco.club@esprit.tn"
              className="inline-flex items-center justify-center border border-amber-500/50 text-amber-400 hover:bg-amber-500/10 rounded-full px-8 h-10 text-sm font-medium transition-all">
              Contactez-nous <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── BOARD ────────────────────────────────── */}
      <section className="relative py-28 px-6 bg-gradient-to-b from-black via-[#041116] to-black overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-4">
              Le <span className="text-cyan-400">Bureau Executif</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="text-gray-400 max-w-2xl mx-auto">
              Une equipe passionnee et devouee qui travaille sans relache pour offrir les meilleures experiences a nos membres.
            </motion.p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {board.map((member, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 cursor-pointer hover:border-cyan-500/30 transition-colors">
                <div className="aspect-[3/4] overflow-hidden">
                  <img src={`/board/${member.file}`} alt={member.role}
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="h-0.5 w-8 bg-cyan-500 mb-2 rounded-full" />
                  <p className="text-cyan-400 text-xs font-semibold uppercase tracking-wider">{member.role}</p>
                </div>
                {/* Admin badge for board members */}
                {isAdmin && (
                  <Link href="/admin" onClick={e => e.stopPropagation()}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                    <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-500/90 backdrop-blur-sm text-black text-[10px] font-bold shadow-lg">
                      <Settings className="h-3 w-3" />Admin
                    </span>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM SECTION ─────────────────── */}
      <ContactSection />

      {/* ── FOOTER ───────────────────────────────── */}
      <footer id="contact" className="relative border-t border-white/10 bg-black py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <img src="/cisco-logo.jpg" alt="Cisco Club ESPRIT" className="h-10 w-10 rounded-full object-cover border border-cyan-500/30" />
              <div>
                <div className="font-bold text-lg">Cisco Club</div>
                <div className="text-xs text-cyan-400 tracking-widest font-medium">ESPRIT</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Formant les ingenieurs reseau et cybersecurite de demain depuis le campus ESPRIT de Tunis, Tunisie.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <InstagramIcon className="h-4 w-4" />, href: "https://www.instagram.com/ciscoclub_esprit/", label: "Instagram" },
                { icon: <LinkedinIcon className="h-4 w-4" />, href: "https://www.linkedin.com/company/cisco-club-esprit/", label: "LinkedIn" },
                { icon: <FacebookIcon className="h-4 w-4" />, href: "https://www.facebook.com/CiscoClubEsprit", label: "Facebook" },
                { icon: <YoutubeIcon className="h-4 w-4" />, href: "https://www.youtube.com/@CiscoClubEsprit", label: "YouTube" },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all duration-200">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-white">Navigation</h3>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              {[
                { label: "A Propos", href: "#about" },
                { label: "Activites", href: "#activities" },
                { label: "Sponsors", href: "#sponsors" },
                { label: "Evenements", href: "/events" },
                { label: "Portail Membre", href: "/auth/login" },
                { label: "Dashboard Admin", href: "/admin" },
              ].map((l) => (
                <Link key={l.label} href={l.href} className="text-gray-400 text-sm hover:text-cyan-400 transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-white">Contact & Rejoindre</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>ESPRIT, 2 Rue Jean-Louis Destombes, Ariana 2083, Tunisie</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="h-4 w-4 text-cyan-400 shrink-0" />
                <a href="mailto:cisco.club@esprit.tn" className="hover:text-cyan-400 transition-colors">cisco.club@esprit.tn</a>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <InstagramIcon className="h-4 w-4 text-cyan-400 shrink-0" />
                <a href="https://www.instagram.com/ciscoclub_esprit/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">@ciscoclub_esprit</a>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 mt-2">
              <p className="text-sm text-cyan-300 font-semibold">Rejoignez-nous !</p>
              <p className="text-xs text-gray-400 mt-1 mb-3">Les inscriptions pour la saison 2024-2025 sont ouvertes.</p>
              <Link href="/auth/register"
                className="inline-flex items-center justify-center bg-cyan-500 text-black hover:bg-cyan-400 rounded-full text-xs h-8 px-4 font-medium transition-all">
                S&apos;inscrire maintenant
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>2024 Cisco Club ESPRIT. Tous droits reserves.</p>
          <p>Made with love by the Cisco Club ESPRIT Tech Team</p>
        </div>
      </footer>
    </div>
  );
}
