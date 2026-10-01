"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie,
  PieChart, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip, XAxis, YAxis, Legend
} from "recharts";
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowUpRight,
  CalendarDays, Download, FileText, Presentation, TrendingUp,
  Users, Wallet, RefreshCw, Bell
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AdminShell } from "@/components/admin-shell";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const memberEvolution = [
  { mois: "Oct", actifs: 102, assiduite: 81 },
  { mois: "Nov", actifs: 118, assiduite: 85 },
  { mois: "Déc", actifs: 122, assiduite: 79 },
  { mois: "Jan", actifs: 130, assiduite: 88 },
  { mois: "Fév", actifs: 138, assiduite: 91 },
  { mois: "Mar", actifs: 150, assiduite: 94 },
];

const eventParticipation = [
  { event: "CCNA Bootcamp", presents: 28, absents: 2, attente: 5 },
  { event: "CyberSec CTF", presents: 92, absents: 8, attente: 15 },
  { event: "Conf. Cloud", presents: 148, absents: 22, attente: 0 },
  { event: "NetRiders", presents: 35, absents: 5, attente: 0 },
  { event: "Wireshark", presents: 24, absents: 6, attente: 2 },
];

const cellDistribution = [
  { name: "Technique", value: 18, color: "#22d3ee" },
  { name: "Événementiel", value: 12, color: "#a855f7" },
  { name: "Communication", value: 8, color: "#10b981" },
  { name: "Sponsoring", value: 6, color: "#f59e0b" },
  { name: "Design", value: 6, color: "#64748b" },
];

const sponsoringMonthly = [
  { mois: "Oct", leve: 0, objectif: 1250 },
  { mois: "Nov", leve: 2000, objectif: 2500 },
  { mois: "Déc", leve: 2000, objectif: 3750 },
  { mois: "Jan", leve: 3500, objectif: 5000 },
  { mois: "Fév", leve: 5500, objectif: 6250 },
  { mois: "Mar", leve: 8500, objectif: 7500 },
];

const cellRadar = [
  { subject: "Assiduité", Technique: 92, Événementiel: 85, Com: 78 },
  { subject: "Livraison", Technique: 88, Événementiel: 90, Com: 70 },
  { subject: "Événements", Technique: 75, Événementiel: 95, Com: 60 },
  { subject: "Dynamisme", Technique: 80, Événementiel: 88, Com: 82 },
  { subject: "Satisfaction", Technique: 85, Événementiel: 92, Com: 75 },
];

const topMembers = [
  { name: "Ahmed Ben Ali", cell: "Technique", score: 97 },
  { name: "Fatma Oueslati", cell: "Événementiel", score: 95 },
  { name: "Sami Trabelsi", cell: "Technique", score: 92 },
  { name: "Ines Mahmoud", cell: "Com", score: 90 },
  { name: "Youssef Gharbi", cell: "Bureau", score: 88 },
];

const ALERTS = [
  { type: "danger", icon: AlertTriangle, text: "3 membres sous le seuil d'assiduité (70%)", link: "/admin/rh", cta: "Voir" },
  { type: "warning", icon: CalendarDays, text: "Bootcamp CCNA : 2 places restantes à J-3", link: "/events", cta: "Voir" },
  { type: "warning", icon: Wallet, text: "Contrat Vermeg expire dans 28 jours", link: "/admin/sponsors", cta: "Voir" },
  { type: "info", icon: Presentation, text: "2 actions de réunion en retard", link: "/admin/meetings", cta: "Voir" },
];

const tooltipStyle = {
  backgroundColor: "#0a0a0a",
  borderColor: "rgba(255,255,255,0.1)",
  borderRadius: "12px",
  color: "#fff",
};

function KpiCard({ title, value, sub, trend, icon: Icon, trendUp, color = "cyan" }: {
  title: string; value: string; sub: string; trend: string; icon: React.ElementType; trendUp?: boolean; color?: string;
}) {
  const colors: Record<string, string> = {
    cyan: "text-cyan-400 bg-cyan-500/10",
    purple: "text-purple-400 bg-purple-500/10",
    green: "text-green-400 bg-green-500/10",
    amber: "text-amber-400 bg-amber-500/10",
    red: "text-red-400 bg-red-500/10",
  };
  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-md hover:border-white/20 transition-all duration-300 group relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${color === 'cyan' ? 'from-cyan-500/5' : color === 'purple' ? 'from-purple-500/5' : color === 'green' ? 'from-green-500/5' : 'from-amber-500/5'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
        <div className={`h-9 w-9 rounded-full flex items-center justify-center ${colors[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-3xl font-extrabold text-white mb-2">{value}</div>
        <p className={`text-xs flex items-center font-medium ${trendUp === false ? "text-red-400" : "text-green-400"}`}>
          {trendUp === false ? <ArrowDownRight className="h-3 w-3 mr-1" /> : <ArrowUpRight className="h-3 w-3 mr-1" />}
          {trend}
        </p>
        <p className="text-xs text-gray-500 mt-1">{sub}</p>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState("semestre");

  return (
    <AdminShell title="Dashboard Analytique" subtitle={`Mis à jour le ${new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}`}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8 max-w-7xl mx-auto pb-12">

        {/* Period filter */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex gap-2">
            {["7j", "30j", "semestre", "année"].map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${period === p ? "bg-cyan-500 text-black font-bold" : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10"}`}>
                {p}
              </button>
            ))}
          </div>
          <Button variant="outline" className="border-white/20 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl">
            <Download className="h-4 w-4 mr-2" /> Exporter PDF
          </Button>
        </div>

        {/* Alertes */}
        <Card className="bg-white/5 border-amber-500/30 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center gap-3 pb-3">
            <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Bell className="h-4 w-4 text-amber-400" />
            </div>
            <CardTitle className="text-base text-white">Centre d'Alertes <span className="text-amber-400 ml-1">({ALERTS.length})</span></CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ALERTS.map((a, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${
                a.type === "danger" ? "border-red-500/30 bg-red-500/10 text-red-200" :
                a.type === "warning" ? "border-amber-500/30 bg-amber-500/10 text-amber-200" :
                "border-cyan-500/30 bg-cyan-500/10 text-cyan-200"
              }`}>
                <div className="flex items-center gap-3 text-sm">
                  <a.icon className="h-4 w-4 shrink-0" />
                  <span>{a.text}</span>
                </div>
                <Link href={a.link} className="text-xs font-bold shrink-0 ml-4 underline underline-offset-2 opacity-70 hover:opacity-100">{a.cta}</Link>
              </div>
            ))}
          </CardContent>
        </Card>

        <Tabs defaultValue="membres" className="space-y-8">
          <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl w-fit">
            <TabsTrigger value="membres" className="rounded-lg data-[state=active]:bg-cyan-500 data-[state=active]:text-black transition-all">
              <Users className="w-4 h-4 mr-2" />Membres
            </TabsTrigger>
            <TabsTrigger value="evenements" className="rounded-lg data-[state=active]:bg-cyan-500 data-[state=active]:text-black transition-all">
              <CalendarDays className="w-4 h-4 mr-2" />Événements
            </TabsTrigger>
            <TabsTrigger value="sponsoring" className="rounded-lg data-[state=active]:bg-cyan-500 data-[state=active]:text-black transition-all">
              <Wallet className="w-4 h-4 mr-2" />Sponsoring
            </TabsTrigger>
            <TabsTrigger value="performance" className="rounded-lg data-[state=active]:bg-cyan-500 data-[state=active]:text-black transition-all">
              <Activity className="w-4 h-4 mr-2" />Performance
            </TabsTrigger>
          </TabsList>

          {/* ── Membres ── */}
          <TabsContent value="membres" className="space-y-6 focus-visible:outline-none">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <KpiCard title="Membres Actifs" value="150" sub="10 nouveaux ce semestre" trend="+12.5% vs sem. préc." icon={Users} trendUp color="cyan" />
              <KpiCard title="Taux d'Assiduité" value="94%" sub="Seuil minimum : 70%" trend="+6pp vs sem. préc." icon={Activity} trendUp color="purple" />
              <KpiCard title="Taux de Rétention" value="87%" sub="Sur 12 mois glissants" trend="-2pp vs an dernier" icon={TrendingUp} trendUp={false} color="amber" />
              <KpiCard title="Membres à Risque" value="3" sub="Sous le seuil (70%)" trend="Alertes envoyées" icon={AlertTriangle} trendUp={false} color="red" />
            </div>

            <div className="grid md:grid-cols-7 gap-6">
              <Card className="md:col-span-4 bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-white">Évolution du Club</CardTitle>
                  <CardDescription className="text-gray-400">Membres actifs & assiduité mensuelle</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={memberEvolution}>
                      <defs>
                        <linearGradient id="gActifs" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gAssiduite" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="mois" tick={{ fontSize: 12, fill: "#6b7280" }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 12, fill: "#6b7280" }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: "#6b7280" }} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend wrapperStyle={{ color: "#9ca3af", fontSize: 12 }} />
                      <Area yAxisId="left" type="monotone" dataKey="actifs" name="Membres actifs" stroke="#22d3ee" fill="url(#gActifs)" strokeWidth={2} />
                      <Area yAxisId="right" type="monotone" dataKey="assiduite" name="Assiduité (%)" stroke="#a855f7" fill="url(#gAssiduite)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="md:col-span-3 bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader>
                  <CardTitle className="text-white">Répartition par Cellule</CardTitle>
                  <CardDescription className="text-gray-400">Distribution des membres actifs</CardDescription>
                </CardHeader>
                <CardContent className="h-72 flex flex-col items-center justify-center">
                  <ResponsiveContainer width="100%" height="70%">
                    <PieChart>
                      <Pie data={cellDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                        {cellDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any, name: any) => [`${value} membres`, name]} contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 w-full px-4">
                    {cellDistribution.map(c => (
                      <div key={c.name} className="flex items-center gap-2 text-xs">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                        <span className="text-gray-400">{c.name}</span>
                        <span className="font-bold ml-auto text-white">{c.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white">Top 5 Membres — Implication</CardTitle>
                <CardDescription className="text-gray-400">Score composite : assiduité + livraison + participation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {topMembers.map((m, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="w-6 text-sm font-bold text-gray-500">#{i + 1}</span>
                    <Avatar className="h-9 w-9 border border-white/10">
                      <AvatarFallback className="bg-white/5 text-cyan-400 text-xs font-bold">{m.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1.5">
                        <p className="text-sm font-semibold text-white">{m.name}</p>
                        <span className="text-sm font-bold text-cyan-400">{m.score}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all" style={{ width: `${m.score}%` }} />
                      </div>
                    </div>
                    <Badge className="bg-white/10 text-gray-300 border-0 text-xs">{m.cell}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Événements ── */}
          <TabsContent value="evenements" className="space-y-6 focus-visible:outline-none">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <KpiCard title="Événements organisés" value="5" sub="Ce semestre" trend="+2 vs sem. préc." icon={CalendarDays} trendUp color="cyan" />
              <KpiCard title="Total Inscrits" value="492" sub="Toutes sessions" trend="+31% vs sem. préc." icon={Users} trendUp color="purple" />
              <KpiCard title="Taux de Présence" value="89%" sub="Présents / Inscrits" trend="+4pp vs sem. préc." icon={Activity} trendUp color="green" />
              <KpiCard title="Satisfaction Moy." value="4.6/5" sub="NPS Club : +42" trend="+0.3 vs sem. préc." icon={TrendingUp} trendUp color="amber" />
            </div>
            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white">Participation par Événement</CardTitle>
                <CardDescription className="text-gray-400">Présents vs absents vs liste d'attente</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={eventParticipation} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="event" tick={{ fontSize: 11, fill: "#6b7280" }} angle={-15} textAnchor="end" />
                    <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend wrapperStyle={{ color: "#9ca3af", fontSize: 12 }} />
                    <Bar dataKey="presents" name="Présents" fill="#22d3ee" radius={[4, 4, 0, 0]} stackId="a" />
                    <Bar dataKey="absents" name="Absents" fill="#ef4444" stackId="a" />
                    <Bar dataKey="attente" name="Liste d'attente" fill="#f59e0b" radius={[4, 4, 0, 0]} stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Sponsoring ── */}
          <TabsContent value="sponsoring" className="space-y-6 focus-visible:outline-none">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <KpiCard title="Levée de fonds" value="8,500 TND" sub="Objectif: 15,000 TND" trend="+3,000 TND vs M-1" icon={Wallet} trendUp color="green" />
              <KpiCard title="Pipeline pondéré" value="10,700 TND" sub="3 prospects actifs" trend="Σ(montant × prob.)" icon={TrendingUp} trendUp color="cyan" />
              <KpiCard title="Sponsors Actifs" value="1" sub="+ 2 en négociation" trend="+1 vs sem. préc." icon={FileText} trendUp color="purple" />
              <KpiCard title="Taux de conversion" value="33%" sub="Prospects → Signés" trend="-5pp (à améliorer)" icon={Activity} trendUp={false} color="amber" />
            </div>
            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white">Fonds Levés vs Objectif</CardTitle>
                <CardDescription className="text-gray-400">Progression mensuelle (en TND)</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sponsoringMonthly}>
                    <defs>
                      <linearGradient id="gObjectif" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6b7280" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6b7280" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gLeve" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="mois" tick={{ fontSize: 12, fill: "#6b7280" }} />
                    <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} tickFormatter={v => `${v / 1000}k`} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`${v.toLocaleString()} TND`]} />
                    <Legend wrapperStyle={{ color: "#9ca3af", fontSize: 12 }} />
                    <Area type="monotone" dataKey="objectif" name="Objectif cumulatif" stroke="#6b7280" fill="url(#gObjectif)" strokeDasharray="5 5" strokeWidth={2} />
                    <Area type="monotone" dataKey="leve" name="Montant levé" stroke="#22d3ee" fill="url(#gLeve)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Performance ── */}
          <TabsContent value="performance" className="space-y-6 focus-visible:outline-none">
            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white">Radar de Performance par Cellule</CardTitle>
                <CardDescription className="text-gray-400">Score composite sur 5 critères (0-100)</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={cellRadar}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: "#9ca3af" }} />
                    <Radar name="Technique" dataKey="Technique" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.25} />
                    <Radar name="Événementiel" dataKey="Événementiel" stroke="#a855f7" fill="#a855f7" fillOpacity={0.25} />
                    <Radar name="Communication" dataKey="Com" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                    <Legend wrapperStyle={{ color: "#9ca3af", fontSize: 12 }} />
                    <Tooltip contentStyle={tooltipStyle} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </AdminShell>
  );
}
