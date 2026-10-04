"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users, CalendarDays, Wallet, TrendingUp, Presentation,
  ArrowUpRight, Activity, AlertTriangle,
  BarChart2, LayoutDashboard, Settings, LogOut, ChevronRight, Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getDashboardStats, getRecentEvents, getRecentMeetings, getRecentSponsors } from "@/actions/stats";
import { useSession } from "next-auth/react";

const dataAssiduite = [
  { name: "Oct", assiduite: 85 },
  { name: "Nov", assiduite: 88 },
  { name: "Déc", assiduite: 82 },
  { name: "Jan", assiduite: 75 },
  { name: "Fév", assiduite: 89 },
  { name: "Mar", assiduite: 94 },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

export default function Dashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [recentMeetings, setRecentMeetings] = useState<any[]>([]);
  const [recentSponsors, setRecentSponsors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboardStats(),
      getRecentEvents(),
      getRecentMeetings(),
      getRecentSponsors(),
    ]).then(([s, ev, mt, sp]) => {
      setStats(s);
      setRecentEvents(ev);
      setRecentMeetings(mt);
      setRecentSponsors(sp);
      setLoading(false);
    });
  }, []);

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AD";

  const kpis = stats ? [
    { title: "Membres Actifs",      val: stats.membersActive.toString(),                icon: <Users className="h-5 w-5 text-cyan-400" />,    bg: "from-cyan-500/20",    trend: "Actifs cette saison" },
    { title: "Taux d'assiduité",    val: stats.attendanceRate > 0 ? `${stats.attendanceRate}%` : "—", icon: <Activity className="h-5 w-5 text-purple-400" />, bg: "from-purple-500/20", trend: "Taux global" },
    { title: "Fonds Levés",         val: `${Number(stats.fundsRaised).toLocaleString("fr-FR")} TND`, icon: <Wallet className="h-5 w-5 text-green-400" />,    bg: "from-green-500/20",   prog: stats.sponsorsActive },
    { title: "Événements Créés",    val: stats.eventsTotal.toString(),                  icon: <CalendarDays className="h-5 w-5 text-amber-400" />, bg: "from-amber-500/20",  trend: `${stats.sponsorsActive} sponsors actifs` },
  ] : Array(4).fill(null);

  const STATUS_EVENT: Record<string, string> = {
    PUBLIE: "bg-green-500/20 text-green-400",
    BROUILLON: "bg-gray-500/20 text-gray-400",
    COMPLET: "bg-purple-500/20 text-purple-400",
    TERMINE: "bg-blue-500/20 text-blue-400",
    ANNULE: "bg-red-500/20 text-red-400",
  };

  const TIER_COLOR: Record<string, string> = {
    Gold: "text-amber-400",
    Silver: "text-gray-300",
    Bronze: "text-orange-400",
    Platinum: "text-cyan-400",
  };

  return (
    <div className="flex min-h-screen w-full bg-black text-white font-sans overflow-hidden selection:bg-cyan-500/30">

      {/* Background ambiance */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-900/20 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px] translate-y-1/3" />
      </div>

      {/* Sidebar */}
      <aside className="w-72 border-r border-white/10 bg-white/[0.02] backdrop-blur-xl hidden md:flex flex-col relative z-20">
        <div className="h-20 flex items-center px-8 border-b border-white/10">
          <Link href="/" className="font-extrabold text-2xl flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all">
              <Activity className="h-5 w-5 text-black" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Cisco Club</span>
          </Link>
        </div>

        <div className="flex-1 py-8 px-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 px-4">Menu Principal</div>
          {[
            { href: "/admin",            icon: <LayoutDashboard className="mr-3 h-5 w-5 text-cyan-400" />, label: "Vue d'ensemble", active: true },
            { href: "/admin/analytics",  icon: <BarChart2 className="mr-3 h-5 w-5" />,     label: "Analytics" },
            { href: "/admin/rh",         icon: <Users className="mr-3 h-5 w-5" />,          label: "Ressources Humaines" },
            { href: "/admin/events",     icon: <CalendarDays className="mr-3 h-5 w-5" />,   label: "Événements" },
            { href: "/admin/sponsors",   icon: <Wallet className="mr-3 h-5 w-5" />,         label: "Sponsoring" },
            { href: "/admin/meetings",   icon: <Presentation className="mr-3 h-5 w-5" />,   label: "Réunions" },
            { href: "/admin/attendance", icon: <TrendingUp className="mr-3 h-5 w-5" />,     label: "Assiduité" },
            { href: "/admin/permissions",icon: <Settings className="mr-3 h-5 w-5" />,       label: "Autorisations" },
          ].map(({ href, icon, label, active }) => (
            <Button key={href} variant="ghost" asChild
              className={`w-full justify-start h-12 rounded-xl px-4 transition-colors ${active ? "text-white bg-white/10 hover:bg-white/15" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
              <Link href={href}>{icon}{label}</Link>
            </Button>
          ))}
        </div>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5 h-12 rounded-xl px-4" asChild>
            <Link href="/admin/profile"><Settings className="mr-3 h-5 w-5" /> Mon Profil</Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-red-400 hover:bg-red-500/10 h-12 rounded-xl px-4" asChild>
            <Link href="/api/auth/signout"><LogOut className="mr-3 h-5 w-5" /> Déconnexion</Link>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
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
                  <AvatarFallback className="bg-gray-800 text-cyan-400 font-bold">{initials}</AvatarFallback>
                </Avatar>
              </div>
            </Link>
          </div>
        </header>

        {/* Scrollable */}
        <div className="flex-1 overflow-y-auto p-8">
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-8 pb-12">

            {/* KPI Cards */}
            <motion.div variants={itemVariants}>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {loading
                  ? Array(4).fill(0).map((_, i) => (
                    <Card key={i} className="bg-white/5 border-white/10 animate-pulse h-36" />
                  ))
                  : kpis.map((kpi, i) => (
                    <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-md overflow-hidden relative group hover:border-white/20 transition-all">
                      <div className={`absolute inset-0 bg-gradient-to-br ${kpi.bg} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                      <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-gray-400">{kpi.title}</CardTitle>
                        <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">{kpi.icon}</div>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <div className="text-3xl font-extrabold text-white mb-2">{kpi.val}</div>
                        {kpi.prog !== undefined ? (
                          <div className="space-y-1.5 mt-1">
                            <Progress value={kpi.prog} className="h-1.5 bg-white/10" />
                            <p className="text-xs text-gray-500">{kpi.prog} sponsors actifs</p>
                          </div>
                        ) : (
                          <p className="text-xs text-green-400 flex items-center font-medium">
                            <ArrowUpRight className="h-3.5 w-3.5 mr-1" /> {kpi.trend}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))
                }
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Tabs defaultValue="overview" className="space-y-8">
                <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl">
                  <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-cyan-500 data-[state=active]:text-black">Vue d&apos;ensemble</TabsTrigger>
                  <TabsTrigger value="events"   className="rounded-lg data-[state=active]:bg-cyan-500 data-[state=active]:text-black">Événements récents</TabsTrigger>
                  <TabsTrigger value="meetings" className="rounded-lg data-[state=active]:bg-cyan-500 data-[state=active]:text-black">Réunions récentes</TabsTrigger>
                  <TabsTrigger value="sponsors" className="rounded-lg data-[state=active]:bg-cyan-500 data-[state=active]:text-black">Sponsors</TabsTrigger>
                </TabsList>

                {/* Overview tab */}
                <TabsContent value="overview" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
                  <div className="grid gap-6 lg:grid-cols-7">
                    <Card className="col-span-4 bg-white/5 border-white/10 backdrop-blur-md">
                      <CardHeader>
                        <CardTitle className="text-xl text-white">Évolution de l&apos;assiduité</CardTitle>
                        <CardDescription className="text-gray-400">Taux mensuel moyen (Saison 2024-2025)</CardDescription>
                      </CardHeader>
                      <CardContent className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={dataAssiduite} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor="#22d3ee" stopOpacity={0.5} />
                                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} domain={[60, 100]} />
                            <Tooltip contentStyle={{ backgroundColor: "#000", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff" }} itemStyle={{ color: "#22d3ee" }} />
                            <Area type="monotone" dataKey="assiduite" name="Assiduité (%)" stroke="#22d3ee" strokeWidth={3} fillOpacity={1} fill="url(#colorA)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card className="col-span-3 bg-white/5 border-white/10 backdrop-blur-md">
                      <CardHeader>
                        <CardTitle className="text-xl text-white">Accès Rapides</CardTitle>
                        <CardDescription className="text-gray-400">Modules principaux</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3 mt-2">
                        {[
                          { href: "/admin/rh",          label: "Gérer les Membres",     icon: <Users className="h-4 w-4" />,       color: "cyan" },
                          { href: "/admin/events",       label: "Créer un Événement",    icon: <CalendarDays className="h-4 w-4" />, color: "purple" },
                          { href: "/admin/meetings",     label: "Planifier une Réunion", icon: <Presentation className="h-4 w-4" />,color: "green" },
                          { href: "/admin/sponsors",     label: "Ajouter un Sponsor",    icon: <Wallet className="h-4 w-4" />,      color: "amber" },
                          { href: "/admin/permissions",  label: "Gérer les Accès",       icon: <Settings className="h-4 w-4" />,    color: "gray" },
                        ].map(({ href, label, icon, color }) => (
                          <Link key={href} href={href}
                            className={`flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:border-${color}-500/30 hover:bg-white/5 transition-all group`}>
                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center bg-${color}-500/10 text-${color}-400`}>{icon}</div>
                            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{label}</span>
                            <ArrowUpRight className="h-3.5 w-3.5 text-gray-600 group-hover:text-gray-300 ml-auto transition-colors" />
                          </Link>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Recent Events */}
                <TabsContent value="events" className="focus-visible:outline-none focus-visible:ring-0">
                  <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-white">Événements récents</CardTitle>
                        <CardDescription className="text-gray-400">Les {recentEvents.length} derniers événements créés</CardDescription>
                      </div>
                      <Button className="bg-cyan-500 text-black hover:bg-cyan-400 rounded-xl font-bold" asChild>
                        <Link href="/admin/events">Gérer tout</Link>
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {loading ? <div className="animate-pulse space-y-3">{Array(4).fill(0).map((_,i)=><div key={i} className="h-14 bg-white/5 rounded-xl"/>)}</div>
                        : recentEvents.length === 0
                          ? <p className="text-gray-500 text-center py-8">Aucun événement créé</p>
                          : recentEvents.map((ev) => (
                            <div key={ev.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                              <div>
                                <p className="font-semibold text-white text-sm">{ev.title}</p>
                                <p className="text-xs text-gray-500">{new Date(ev.startDate).toLocaleDateString("fr-FR")} · {ev.category}</p>
                              </div>
                              <Badge className={`border-0 text-xs ${STATUS_EVENT[ev.status] ?? "bg-gray-500/20 text-gray-400"}`}>{ev.status}</Badge>
                            </div>
                          ))
                      }
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Recent Meetings */}
                <TabsContent value="meetings" className="focus-visible:outline-none focus-visible:ring-0">
                  <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-white">Réunions récentes</CardTitle>
                        <CardDescription className="text-gray-400">Les {recentMeetings.length} dernières réunions</CardDescription>
                      </div>
                      <Button className="bg-cyan-500 text-black hover:bg-cyan-400 rounded-xl font-bold" asChild>
                        <Link href="/admin/meetings">Gérer tout</Link>
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {loading ? <div className="animate-pulse space-y-3">{Array(4).fill(0).map((_,i)=><div key={i} className="h-14 bg-white/5 rounded-xl"/>)}</div>
                        : recentMeetings.length === 0
                          ? <p className="text-gray-500 text-center py-8">Aucune réunion planifiée</p>
                          : recentMeetings.map((mt) => (
                            <Link key={mt.id} href={`/admin/meetings/${mt.id}`}
                              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/20 hover:bg-white/5 transition-all group">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                                  <Presentation className="h-4 w-4 text-cyan-400" />
                                </div>
                                <div>
                                  <p className="font-semibold text-white text-sm group-hover:text-cyan-400 transition-colors">{mt.title}</p>
                                  <p className="text-xs text-gray-500">{mt.type} · {new Date(mt.startDate).toLocaleDateString("fr-FR")} · {mt.participants.length} participants</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-3.5 w-3.5 text-gray-500" />
                                <span className="text-xs text-gray-500">{new Date(mt.startDate).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span>
                              </div>
                            </Link>
                          ))
                      }
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Sponsors */}
                <TabsContent value="sponsors" className="focus-visible:outline-none focus-visible:ring-0">
                  <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-white">Sponsors & Partenaires</CardTitle>
                        <CardDescription className="text-gray-400">{recentSponsors.length} sponsors récents</CardDescription>
                      </div>
                      <Button className="bg-cyan-500 text-black hover:bg-cyan-400 rounded-xl font-bold" asChild>
                        <Link href="/admin/sponsors">Gérer tout</Link>
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {loading ? <div className="animate-pulse space-y-3">{Array(4).fill(0).map((_,i)=><div key={i} className="h-14 bg-white/5 rounded-xl"/>)}</div>
                        : recentSponsors.length === 0
                          ? <p className="text-gray-500 text-center py-8">Aucun sponsor ajouté</p>
                          : recentSponsors.map((sp) => (
                            <div key={sp.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                  <Wallet className="h-4 w-4 text-amber-400" />
                                </div>
                                <div>
                                  <p className={`font-bold text-sm ${TIER_COLOR[sp.tier] ?? "text-white"}`}>{sp.name}</p>
                                  <p className="text-xs text-gray-500">{sp.tier}</p>
                                </div>
                              </div>
                              <Badge className={`border-0 text-xs ${sp.status === "ACTIF" ? "bg-green-500/20 text-green-400" : sp.status === "NEGOCIE" ? "bg-amber-500/20 text-amber-400" : "bg-gray-500/20 text-gray-400"}`}>
                                {sp.status}
                              </Badge>
                            </div>
                          ))
                      }
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
