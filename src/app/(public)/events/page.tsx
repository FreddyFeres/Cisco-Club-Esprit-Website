"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Users, Play, ArrowRight, Activity, Mail, ExternalLink } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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

const MOCK_EVENTS = [
  {
    id: "1",
    title: "Bootcamp CCNA Intensif",
    category: "Formation",
    startDate: new Date("2024-11-15T09:00:00"),
    location: "Salle 04 - Batiment C",
    capacity: 30,
    enrolled: 28,
    status: "PUBLIE",
  },
  {
    id: "2",
    title: "Hackathon CyberSec",
    category: "Competition",
    startDate: new Date("2024-12-01T18:00:00"),
    location: "Hub Innovation",
    capacity: 100,
    enrolled: 100,
    status: "COMPLET",
  },
  {
    id: "3",
    title: "Conference: L'avenir du Cloud",
    category: "Conference",
    startDate: new Date("2024-11-20T14:00:00"),
    location: "Amphitheatre",
    capacity: 200,
    enrolled: 150,
    status: "PUBLIE",
  }
];

const PREVIOUS_EVENTS = [
  {
    id: "telco",
    name: "Telco Day 2026",
    description: "Telco Day 2026 is a technology and telecommunications event organized at ESPRIT under the theme \"Artificial Intelligence & Future Networks – A New Era Begins.\" The event brings together students, engineers, professionals, and technology enthusiasts to explore the latest developments in Artificial Intelligence, IoT, 5G and 6G networks, cybersecurity, cloud computing, and network virtualization. Through expert conferences, interactive discussions, and networking opportunities, participants will discover how AI is transforming the telecommunications industry, explore emerging technologies and career opportunities, and connect with industry professionals for potential internships and PFE opportunities.",
    media: [
      { type: "video", url: "/events/telco-day/AQNZKNDmNFqLEdI1MmUoW8CfcxwXoVe5j9k0qPgsCoYSJITAwJM2bx8WrJmB5jo1vhlOtRElHXhsZSALvII_SCl69AlzzCQv (1).mp4" },
      { type: "image", url: "/events/telco-day/702298596_17894861121463103_5885478620322391840_n..webp" },
      { type: "image", url: "/events/telco-day/702486849_17894861100463103_1472704610115303997_n..webp" },
      { type: "image", url: "/events/telco-day/702545531_17894861109463103_1459749167786251277_n..webp" },
      { type: "image", url: "/events/telco-day/702669137_17894861139463103_4746756599662511515_n..webp" },
      { type: "image", url: "/events/telco-day/702677145_17894861130463103_7095519941436354289_n..webp" },
      { type: "image", url: "/events/telco-day/702946375_17894861085463103_8423558154934979958_n..webp" },
    ]
  },
  {
    id: "hackathon",
    name: "ESPRIT Hackathon – Smart Campus Challenge 2026",
    description: "ESPRIT Hackathon – Smart Campus Challenge 2026 is an innovation-focused hackathon designed to challenge participants to imagine and build the campus of the future. Centered around the concept of a smart, secure, sustainable, and connected campus, the event encourages students to develop practical solutions combining IoT, networking, Artificial Intelligence, cybersecurity, energy optimization, and smart infrastructure. Participants work in teams to transform their ideas into innovative prototypes and demonstrate how emerging technologies can improve campus life, safety, connectivity, and sustainability. The 2026 edition took place at ESPRIT on May 9–10, 2026, with projects exploring areas such as intelligent parking, smart lighting, IoT monitoring, network optimization, real-time dashboards, and AI-driven decision-making.",
    media: [
      { type: "video", url: "/events/hackathon/AQMxxiwbjd-Fh34UzMPib6wl2DJLMm0UySlWVy3IHx31dGZIbjrRGfMhJoxHPDcazp4o0H6CnglM-H88w1ku0SKtrej5TItm.mp4" },
      { type: "video", url: "/events/hackathon/AQN79R332-3j79rIbQeSfgG1u-oQhxb3W-r2_UUDQkJpxoPFGOa-QEztaCS5YqFrq1xS5g8hF5P5IIbHed545v-_MZyyGg4U.mp4" },
      { type: "video", url: "/events/hackathon/AQNpliymD-HzLFO7amWPlNNYXtRTVoeEGNfABTGkcby8EMR55earHM43RsVqjCs7WK4fwqpXMU64CR-9ToLrjjH2XI03s0Xv.mp4" },
      { type: "video", url: "/events/hackathon/AQOdeI5ivqIQzWYqb-h109JyRzAx6HtlgZ_3eUsI1dhlcoixe1kehiAOHK-kyOaisVoEcbpXADe2Ij4pnAjBAuSyphxeP1Jq (1).mp4" },
      { type: "image", url: "/events/hackathon/662377758_17893714452463103_1626497324064055407_n..webp" },
      { type: "image", url: "/events/hackathon/662732517_17893714401463103_4010214407089978244_n..webp" },
      { type: "image", url: "/events/hackathon/670340110_17893714479463103_883762795007655477_n..webp" },
      { type: "image", url: "/events/hackathon/688588948_17893714512463103_8354432499593466533_n..webp" },
      { type: "image", url: "/events/hackathon/689715111_17893937910463103_5407196368625575891_n..webp" },
      { type: "image", url: "/events/hackathon/689913492_17893937808463103_1656638056154378070_n..webp" },
      { type: "image", url: "/events/hackathon/689946500_17893937829463103_1459312703608882681_n..webp" },
      { type: "image", url: "/events/hackathon/692504151_17893937847463103_505776452001172811_n..webp" },
      { type: "image", url: "/events/hackathon/692913060_17893714431463103_1320330944333523462_n..webp" },
      { type: "image", url: "/events/hackathon/694129461_17894081151463103_1055243871888969116_n..webp" },
      { type: "image", url: "/events/hackathon/694278416_17893937892463103_1790662747046621285_n..webp" },
      { type: "image", url: "/events/hackathon/696090830_17893937883463103_5213826647664600615_n..webp" },
      { type: "image", url: "/events/hackathon/696232469_17893937817463103_3515865069322069787_n..webp" },
      { type: "image", url: "/events/hackathon/696232724_17893937838463103_4924111241544463550_n..webp" },
      { type: "image", url: "/events/hackathon/696272800_17894081226463103_8398189424760840779_n..webp" },
    ]
  }
];

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState(PREVIOUS_EVENTS[0].id);

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      
      {/* ── NAV ─────────────────────────────────────── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto"
      >
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
            <Activity className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight leading-none group-hover:text-cyan-400 transition-colors">Cisco Club</span>
            <span className="block text-xs text-cyan-400 font-medium tracking-widest">ESPRIT</span>
          </div>
        </Link>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
          <Link href="/#about" className="hover:text-cyan-400 transition-colors">A Propos</Link>
          <Link href="/#activities" className="hover:text-cyan-400 transition-colors">Activites</Link>
          <Link href="/events" className="text-cyan-400 transition-colors">Evenements</Link>
        </div>
        <Link 
          href="/auth/login"
          className="inline-flex items-center justify-center border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 rounded-full px-6 h-10 text-sm font-medium transition-colors"
        >
          Acces Portail
        </Link>
      </motion.nav>

      {/* ── HEADER ────────────────────────────────────── */}
      <div className="relative pt-16 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-black to-black z-0 pointer-events-none" />
        <div className="max-w-7xl relative z-10 mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-medium mb-6">
            <CalendarDays className="h-4 w-4" /> Programme
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-400"
          >
            Nos Evenements
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Decouvrez nos prochains ateliers, bootcamps et conferences. Inscrivez-vous pour reserver votre place et participez a l&apos;aventure Cisco Club ESPRIT.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-24 space-y-32">
        
        {/* ── UPCOMING EVENTS ───────────────────────────── */}
        <section>
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-3xl font-bold">Prochainement</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/50 to-transparent" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_EVENTS.map((event, i) => (
              <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="flex flex-col h-full bg-white/5 border-white/10 backdrop-blur-md hover:border-cyan-500/50 hover:bg-white/10 transition-all group overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-colors" />
                  <CardHeader className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="outline" className="text-cyan-400 border-cyan-400/50 bg-cyan-400/10">
                        {event.category}
                      </Badge>
                      {event.status === "COMPLET" ? (
                        <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/20">Complet</Badge>
                      ) : (
                        <Badge className="bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border-cyan-500/50">Places dispo</Badge>
                      )}
                    </div>
                    <CardTitle className="text-2xl text-white group-hover:text-cyan-400 transition-colors">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4 text-sm text-gray-400 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-black/50 border border-white/5"><CalendarDays className="h-4 w-4 text-cyan-500" /></div>
                      <span>{event.startDate.toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-black/50 border border-white/5"><MapPin className="h-4 w-4 text-cyan-500" /></div>
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-black/50 border border-white/5"><Users className="h-4 w-4 text-cyan-500" /></div>
                      <span>{event.enrolled} / {event.capacity} inscrits</span>
                    </div>
                  </CardContent>
                  <CardFooter className="relative z-10">
                    <Link 
                      href={`/events/${event.id}`}
                      className={`inline-flex items-center justify-center w-full rounded-full transition-all h-12 font-semibold ${
                        event.status === "COMPLET" 
                          ? "bg-transparent border border-white/20 text-white hover:bg-white/10" 
                          : "bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                      }`}
                    >
                      {event.status === "COMPLET" ? "Rejoindre liste d'attente" : "S'inscrire"}
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── PREVIOUS EVENTS SHOWCASE ──────────────────── */}
        <section>
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-3xl font-bold">Revivre nos Evenements</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-purple-500/50 to-transparent" />
          </div>

          <div className="flex flex-wrap gap-3 mb-10">
            {PREVIOUS_EVENTS.map(event => (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event.id)}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                  selectedEvent === event.id 
                    ? "bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]" 
                    : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {event.name}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {PREVIOUS_EVENTS.map(event => {
              if (event.id !== selectedEvent) return null;
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.98, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-8"
                >
                  <div className="max-w-2xl border-l-4 border-purple-500 pl-6 py-2">
                    <h3 className="text-3xl font-bold text-white mb-3">{event.name}</h3>
                    <p className="text-gray-400 text-lg leading-relaxed">{event.description}</p>
                  </div>

                  {/* Masonry/Grid Gallery */}
                  <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    {event.media.map((item, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 shadow-2xl break-inside-avoid"
                      >
                        {item.type === "video" ? (
                          <>
                            <video 
                              src={item.url} 
                              autoPlay 
                              muted 
                              loop 
                              playsInline 
                              className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="h-16 w-16 rounded-full bg-purple-500/80 backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.5)] pointer-events-none">
                                <Play className="h-6 w-6 text-white ml-1" />
                              </div>
                            </div>
                          </>
                        ) : (
                          <img 
                            src={item.url} 
                            alt={`${event.name} media ${idx}`} 
                            className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                          />
                        )}
                        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </section>

      </div>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer id="contact" className="relative border-t border-white/10 bg-black py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                <Activity className="h-5 w-5 text-cyan-400" />
              </div>
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
                { label: "A Propos", href: "/#about" },
                { label: "Activites", href: "/#activities" },
                { label: "Sponsors", href: "/#sponsors" },
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
              <p className="text-sm text-cyan-300 font-semibold">🎯 Rejoignez-nous !</p>
              <p className="text-xs text-gray-400 mt-1 mb-3">Les inscriptions pour la saison 2024-2025 sont ouvertes.</p>
              <Link href="/auth/register"
                className="inline-flex items-center justify-center bg-cyan-500 text-black hover:bg-cyan-400 rounded-full text-xs h-8 px-4 font-medium transition-all">
                S&apos;inscrire maintenant
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Cisco Club ESPRIT. Tous droits reserves.</p>
          <p>Made with ❤️ by the Cisco Club ESPRIT Tech Team</p>
        </div>
      </footer>
    </div>
  );
}
