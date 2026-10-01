"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Send, CheckCircle2, Loader2, User, Mail, Phone, GraduationCap, BookOpen, MessageSquare } from "lucide-react";
import { submitCandidature } from "@/actions/candidatures";

const itemFadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const SPECIALTIES = [
  "Informatique", "Réseaux & Télécoms", "Génie Logiciel",
  "Cybersécurité", "Intelligence Artificielle", "Cloud Computing", "Autre"
];
const LEVELS = ["1ère Année", "2ème Année", "3ème Année", "Master 1", "Master 2"];
const CELLS = [
  "Technique & Réseaux", "Cybersécurité", "Développement Logiciel",
  "Intelligence Artificielle", "Communication & Design", "Événementiel", "Sponsoring & Relations Externes"
];

export default function RecrutementPage() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    level: "", specialty: "", cell: "", motivation: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.level || !form.cell) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setError("");
    setLoading(true);
    const res = await submitCandidature({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone || undefined,
      level: form.level,
      specialty: form.specialty || undefined,
      cell: form.cell,
      motivation: form.motivation || undefined,
    });
    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/3 w-[700px] h-[700px] bg-cyan-900/20 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px] translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-900/10 rounded-full blur-[80px]" />
        {/* Grid */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/cisco-logo.jpg" alt="Cisco Club ESPRIT" className="h-12 w-12 rounded-full object-cover border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]" />
          <span className="font-bold text-white group-hover:text-cyan-400 transition-colors hidden sm:block">Cisco Club ESPRIT</span>
        </Link>
        <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Retour au site
        </Link>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-16">

          {/* Hero + Poster */}
          <motion.div variants={itemFadeUp} className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left: Text */}
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
                </span>
                Recrutement Ouvert — 2026
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
                Rejoins le{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
                  Cisco Club
                </span>{" "}
                ESPRIT
              </h1>

              <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                Passionné(e) par les réseaux, la cybersécurité, l&apos;IA ou le cloud ? Rejoins une communauté de futurs ingénieurs
                qui repoussent les limites de la technologie. Certifications Cisco, hackathons, conférences, projets réels — tout t&apos;attend.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                {[
                  { v: "100+", l: "Membres actifs" },
                  { v: "3", l: "Événements majeurs / an" },
                  { v: "5+", l: "Partenaires industriels" },
                ].map(({ v, l }) => (
                  <div key={l} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-extrabold text-cyan-400">{v}</p>
                    <p className="text-xs text-gray-400 mt-1">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Poster */}
            <div className="flex-shrink-0 relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-cyan-500/20 via-purple-500/10 to-blue-500/20 rounded-3xl blur-2xl" />
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src="/cisco-logo.jpg"
                  alt="Recrutement Cisco Club ESPRIT 2026"
                  className="w-64 h-64 sm:w-80 sm:h-80 object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Form or Success */}
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto text-center py-16 space-y-6"
            >
              <div className="flex justify-center">
                <div className="h-24 w-24 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                  <CheckCircle2 className="h-12 w-12 text-green-400" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white">Candidature envoyée !</h2>
              <p className="text-gray-400">
                Merci <span className="text-cyan-400 font-semibold">{form.firstName}</span> ! Nous avons bien reçu ta candidature.
                Tu recevras une réponse sur <span className="text-cyan-400">{form.email}</span> très prochainement.
              </p>
              <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Retour à l&apos;accueil
              </Link>
            </motion.div>
          ) : (
            <motion.div variants={itemFadeUp}>
              <div className="max-w-3xl mx-auto">
                <div className="relative bg-white/[0.03] border border-white/10 rounded-3xl p-8 sm:p-10 backdrop-blur-xl overflow-hidden">
                  {/* Glow corner */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white">Formulaire de Candidature</h2>
                    <p className="text-gray-400 text-sm mt-1">Tous les champs marqués <span className="text-cyan-400">*</span> sont obligatoires</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Row 1: Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300 font-medium flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-cyan-400" /> Prénom <span className="text-cyan-400">*</span>
                        </label>
                        <input name="firstName" value={form.firstName} onChange={handleChange}
                          placeholder="Ex: Mohamed"
                          className="w-full h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300 font-medium flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-cyan-400" /> Nom <span className="text-cyan-400">*</span>
                        </label>
                        <input name="lastName" value={form.lastName} onChange={handleChange}
                          placeholder="Ex: Ben Ali"
                          className="w-full h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all" />
                      </div>
                    </div>

                    {/* Row 2: Email + Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300 font-medium flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-cyan-400" /> Email ESPRIT <span className="text-cyan-400">*</span>
                        </label>
                        <input name="email" type="email" value={form.email} onChange={handleChange}
                          placeholder="prenom.nom@esprit.tn"
                          className="w-full h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300 font-medium flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-cyan-400" /> Téléphone
                        </label>
                        <input name="phone" value={form.phone} onChange={handleChange}
                          placeholder="+216 XX XXX XXX"
                          className="w-full h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all" />
                      </div>
                    </div>

                    {/* Row 3: Level + Specialty */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300 font-medium flex items-center gap-1.5">
                          <GraduationCap className="h-3.5 w-3.5 text-cyan-400" /> Niveau <span className="text-cyan-400">*</span>
                        </label>
                        <select name="level" value={form.level} onChange={handleChange}
                          className="w-full h-11 rounded-xl border border-white/10 bg-black px-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all cursor-pointer">
                          <option value="" disabled>Sélectionner...</option>
                          {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-300 font-medium flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5 text-cyan-400" /> Spécialité
                        </label>
                        <select name="specialty" value={form.specialty} onChange={handleChange}
                          className="w-full h-11 rounded-xl border border-white/10 bg-black px-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all cursor-pointer">
                          <option value="" disabled>Sélectionner...</option>
                          {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Cell preference */}
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300 font-medium flex items-center gap-1.5">
                        Cellule souhaitée <span className="text-cyan-400">*</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {CELLS.map(cell => (
                          <label key={cell}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                              form.cell === cell
                                ? "border-cyan-500/60 bg-cyan-500/15 text-cyan-300"
                                : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-white"
                            }`}
                          >
                            <input type="radio" name="cell" value={cell} checked={form.cell === cell}
                              onChange={handleChange} className="sr-only" />
                            <span className={`h-2 w-2 rounded-full flex-shrink-0 ${form.cell === cell ? "bg-cyan-400" : "bg-gray-600"}`} />
                            {cell}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Motivation */}
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300 font-medium flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5 text-cyan-400" /> Lettre de motivation
                      </label>
                      <textarea name="motivation" value={form.motivation} onChange={handleChange}
                        rows={4}
                        placeholder="Pourquoi veux-tu rejoindre le Cisco Club ESPRIT ? Quelles sont tes compétences et tes ambitions ?"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none" />
                    </div>

                    {error && (
                      <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>
                    )}

                    <button type="submit" disabled={loading}
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {loading ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Envoi en cours...</>
                      ) : (
                        <><Send className="h-4 w-4" /> Soumettre ma candidature</>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
