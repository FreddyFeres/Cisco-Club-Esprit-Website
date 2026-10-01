"use client";

import React from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users, CalendarDays, Wallet, TrendingUp, Presentation,
  ArrowUpRight, Activity, AlertTriangle,
  BarChart2, LayoutDashboard, Settings, LogOut, ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const dataAssiduite = [
  { name: "Oct", assiduite: 85 },
  { name: "Nov", assiduite: 88 },
  { name: "Déc", assiduite: 82 },
  { name: "Jan", assiduite: 75 },
  { name: "Fév", assiduite: 89 },
  { name: "Mar", assiduite: 94 },
];

const dataSponsoring = [
  { name: "Cisco", amount: 5000, status: "Actif" },
  { name: "Vermeg", amount: 2000, status: "Négociation" },
  { name: "Proxym", amount: 1500, status: "Signé" },
];

const ALERTS = [
  { type: "danger", text: "3 membres sous le seuil d'assiduité (70%)" },
  { type: "warning", text: "Contrat Vermeg expire dans 28 jours" },
  { type: "info", text: "2 actions de réunion en retard" },
];

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

export default function Dashboard() {
  return (
    <div className="flex min-h-screen w-full bg-black text-white font-sans overflow-hidden selection:bg-cyan-500/30">
      
      {/* ── BACKGROUND AMBIANCE ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-900/20 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px] translate-y-1/3" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5" />
      </div>

      {/* ── SIDEBAR ── */}
      <aside className="w-72 border-r border-white/10 bg-white/[0.02] backdrop-blur-xl hidden md:flex flex-col relative z-20">
        <div className="h-20 flex items-center px-8 border-b border-white/10">
          <Link href="/" className="font-extrabold text-2xl flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all">
              <Activity className="h-5 w-5 text-black" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Cisco Club</span>
          </Link>
        </div>
        
        <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 px-4">Menu Principal</div>
          
          <Button variant="ghost" className="w-full justify-start text-white bg-white/10 hover:bg-white/15 h-12 rounded-xl px-4" asChild>
            <Link href="/admin">
              <LayoutDashboard className="mr-3 h-5 w-5 text-cyan-400" />
              Vue d'ensemble
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5 h-12 rounded-xl px-4 transition-colors" asChild>
            <Link href="/admin/analytics">
              <BarChart2 className="mr-3 h-5 w-5" /> Analytics
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5 h-12 rounded-xl px-4 transition-colors" asChild>
            <Link href="/admin/rh">
              <Users className="mr-3 h-5 w-5" /> Ressources Humaines
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5 h-12 rounded-xl px-4 transition-colors" asChild>
            <Link href="/events">
              <CalendarDays className="mr-3 h-5 w-5" /> Événements
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5 h-12 rounded-xl px-4 transition-colors" asChild>
            <Link href="/admin/sponsors">
              <Wallet className="mr-3 h-5 w-5" /> Sponsoring & Partenariats
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5 h-12 rounded-xl px-4 transition-colors" asChild>
            <Link href="/admin/meetings">
              <Presentation className="mr-3 h-5 w-5" /> Réunions
            </Link>
          </Button>
        </div>

        <div className="p-4 border-t border-white/10">
          <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-red-500/20 hover:text-red-400 h-12 rounded-xl px-4 transition-colors" asChild>
            <Link href="/api/auth/signout">
              <LogOut className="mr-3 h-5 w-5" /> Déconnexion
            </Link>
          </Button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col relative z-10 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-white/10 bg-black/40 backdrop-blur-md shrink-0">
          <div>
            <h1 className="font-bold text-2xl text-white">Dashboard <span className="text-cyan-400 font-normal">Exécutif</span></h1>
          </div>
          <div className="flex items-center gap-6">
            <Button variant="outline" className="hidden sm:flex border-white/20 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 rounded-full px-6" asChild>
              <Link href="/admin/analytics">Rapport complet <ChevronRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <div className="h-8 w-px bg-white/20 hidden sm:block" />
            <Link href="/admin/profile">
              <div className="relative group cursor-pointer">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-300" />
                <Avatar className="relative h-10 w-10 border-2 border-black">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="bg-gray-800 text-cyan-400 font-bold">EX</AvatarFallback>
                </Avatar>
              </div>
            </Link>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="show" 
            className="max-w-7xl mx-auto space-y-8 pb-12"
          >
            {/* Alertes */}
            <motion.div variants={itemVariants} className="space-y-3">
              {ALERTS.map((a, i) => (
                <div key={i} className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-sm ${
                  a.type === "danger" ? "border-red-500/30 bg-red-500/10 text-red-200" :
                  a.type === "warning" ? "border-amber-500/30 bg-amber-500/10 text-amber-200" :
                  "border-cyan-500/30 bg-cyan-500/10 text-cyan-200"
                }`}>
                  <AlertTriangle className={`h-5 w-5 ${a.type === 'danger' ? 'text-red-400' : a.type === 'warning' ? 'text-amber-400' : 'text-cyan-400'}`} />
                  <span className="font-medium text-sm">{a.text}</span>
                </div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants}>
              <Tabs defaultValue="overview" className="space-y-8">
                <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl">
                  <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-cyan-500 data-[state=active]:text-black transition-all">Vue d'ensemble</TabsTrigger>
                  <TabsTrigger value="members" className="rounded-lg data-[state=active]:bg-cyan-500 data-[state=active]:text-black transition-all">Membres</TabsTrigger>
                  <TabsTrigger value="events" className="rounded-lg data-[state=active]:bg-cyan-500 data-[state=active]:text-black transition-all">Événements</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-8 focus-visible:outline-none focus-visible:ring-0">
                  
                  {/* KPI Cards */}
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[
                      { title: "Membres Actifs", val: "150", icon: <Users className="h-5 w-5 text-cyan-400" />, trend: "+12%", bg: "from-cyan-500/20" },
                      { title: "Taux d'assiduité", val: "94%", icon: <Activity className="h-5 w-5 text-purple-400" />, trend: "+6pp", bg: "from-purple-500/20" },
                      { title: "Fonds Levés", val: "8,500 TND", icon: <Wallet className="h-5 w-5 text-green-400" />, prog: 57, bg: "from-green-500/20" },
                      { title: "Capacité Événements", val: "89%", icon: <CalendarDays className="h-5 w-5 text-amber-400" />, trend: "Excellent", bg: "from-amber-500/20" },
                    ].map((kpi, i) => (
                      <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-md overflow-hidden relative group">
                        <div className={`absolute inset-0 bg-gradient-to-br ${kpi.bg} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                        <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                          <CardTitle className="text-sm font-medium text-gray-400">{kpi.title}</CardTitle>
                          <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                            {kpi.icon}
                          </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                          <div className="text-3xl font-extrabold text-white mb-2">{kpi.val}</div>
                          {kpi.prog ? (
                            <div className="space-y-2 mt-2">
                              <Progress value={kpi.prog} className="h-1.5 bg-white/10" indicatorClassName="bg-green-400" />
                              <p className="text-xs text-gray-500">{kpi.prog}% de l'objectif annuel</p>
                            </div>
                          ) : (
                            <p className="text-xs text-green-400 flex items-center font-medium">
                              <ArrowUpRight className="h-3.5 w-3.5 mr-1" /> {kpi.trend}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Charts */}
                  <div className="grid gap-6 lg:grid-cols-7">
                    <Card className="col-span-4 bg-white/5 border-white/10 backdrop-blur-md">
                      <CardHeader>
                        <CardTitle className="text-xl text-white">Évolution de l'assiduité</CardTitle>
                        <CardDescription className="text-gray-400">Taux mensuel moyen (Saison 2024-2025)</CardDescription>
                      </CardHeader>
                      <CardContent className="h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={dataAssiduite} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorAssiduite" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.5} />
                                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} domain={[60, 100]} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: "#000", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }}
                              itemStyle={{ color: "#22d3ee" }}
                            />
                            <Area type="monotone" dataKey="assiduite" name="Assiduité (%)" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorAssiduite)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card className="col-span-3 bg-white/5 border-white/10 backdrop-blur-md">
                      <CardHeader>
                        <CardTitle className="text-xl text-white">Pipeline Sponsoring</CardTitle>
                        <CardDescription className="text-gray-400">Suivi des deals actuels</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6 mt-4">
                          {dataSponsoring.map((sponsor, i) => (
                            <div key={i} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <p className="font-semibold text-white">{sponsor.name}</p>
                                <div className="flex items-center gap-3">
                                  <Badge className={`h-5 px-2 text-[10px] uppercase font-bold border-0 ${
                                    sponsor.status === "Actif" ? "bg-green-500/20 text-green-400" :
                                    sponsor.status === "Signé" ? "bg-cyan-500/20 text-cyan-400" :
                                    "bg-amber-500/20 text-amber-400"
                                  }`}>
                                    {sponsor.status}
                                  </Badge>
                                  <span className="font-bold text-gray-300 tabular-nums">{sponsor.amount.toLocaleString()} TND</span>
                                </div>
                              </div>
                              <Progress value={Math.round(sponsor.amount / 50)} className="h-2 bg-white/10" 
                                indicatorClassName={sponsor.status === "Actif" ? "bg-green-400" : "bg-cyan-400"} />
                            </div>
                          ))}
                        </div>
                        <Button className="w-full mt-8 bg-white/10 hover:bg-white/20 text-white border-0" variant="outline" asChild>
                          <Link href="/admin/sponsors">Voir le Kanban Complet <ArrowUpRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Other Tabs content */}
                <TabsContent value="members">
                  <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                    <CardContent className="pt-8 pb-8 text-center">
                      <Users className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">Gestion des Membres</h3>
                      <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
                        Accédez au module RH complet pour gérer les profils, les cellules et les évaluations des membres du club.
                      </p>
                      <Button className="bg-cyan-500 text-black hover:bg-cyan-400 font-bold px-8" asChild>
                        <Link href="/admin/rh">Ouvrir le Module RH</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="events">
                  <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                    <CardContent className="pt-8 pb-8 text-center">
                      <CalendarDays className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">Événements & Pointage</h3>
                      <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
                        Gérez la publication des événements et le pointage par code QR ou présence manuelle.
                      </p>
                      <div className="flex gap-4 justify-center">
                        <Button className="bg-white/10 text-white hover:bg-white/20 font-bold px-6" asChild>
                          <Link href="/events">Explorer</Link>
                        </Button>
                        <Button className="bg-cyan-500 text-black hover:bg-cyan-400 font-bold px-6" asChild>
                          <Link href="/admin/attendance">Gérer le Pointage</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>

          </motion.div>
        </div>
      </main>
    </div>
  );
}
