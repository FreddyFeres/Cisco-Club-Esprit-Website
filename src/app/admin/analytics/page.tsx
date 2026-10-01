"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie,
  PieChart, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip, XAxis, YAxis, Legend
} from "recharts";
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, Bell,
  CalendarDays, Download, FileText, Presentation, TrendingUp,
  Users, Wallet, RefreshCw, Filter
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
  { event: "CyberSec Hackathon", presents: 92, absents: 8, attente: 15 },
  { event: "Conf. Cloud", presents: 148, absents: 22, attente: 0 },
  { event: "NetRiders Prep", presents: 35, absents: 5, attente: 0 },
  { event: "Atelier Wireshark", presents: 24, absents: 6, attente: 2 },
];

const cellDistribution = [
  { name: "Technique", value: 18, color: "#00BCEB" },
  { name: "Événementiel", value: 12, color: "#049FD9" },
  { name: "Communication", value: 8, color: "#00947A" },
  { name: "Sponsoring", value: 6, color: "#0D274D" },
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
  { type: "danger", icon: AlertTriangle, text: "3 membres sous le seuil d'assiduité (70%)", link: "/admin/rh", cta: "Voir les membres" },
  { type: "warning", icon: CalendarDays, text: "Bootcamp CCNA : 2 places restantes à J-3", link: "/events/1", cta: "Voir l'événement" },
  { type: "warning", icon: Wallet, text: "Contrat Vermeg expire dans 28 jours", link: "/admin/sponsors", cta: "Voir le contrat" },
  { type: "info", icon: Presentation, text: "2 actions de réunion en retard (responsables relancés)", link: "/admin/meetings/1", cta: "Voir les actions" },
];

// ─── Sub-components ────────────────────────────────────────────────────────────
function KpiCard({ title, value, sub, trend, icon: Icon, trendUp }: {
  title: string; value: string; sub: string; trend: string; icon: React.ElementType; trendUp?: boolean;
}) {
  return (
    <Card className="hover:border-primary/40 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tabular-nums">{value}</div>
        <p className={`text-xs flex items-center mt-1 ${trendUp === false ? "text-destructive" : "text-green-500"}`}>
          {trendUp === false
            ? <ArrowDownRight className="h-3 w-3 mr-1" />
            : <ArrowUpRight className="h-3 w-3 mr-1" />}
          {trend}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{sub}</p>
      </CardContent>
    </Card>
  );
}

function AlertBanner({ type, icon: Icon, text, link, cta }: (typeof ALERTS)[0]) {
  const colors = {
    danger: "border-l-4 border-l-destructive bg-destructive/10",
    warning: "border-l-4 border-l-amber-500 bg-amber-500/10",
    info: "border-l-4 border-l-primary bg-primary/10",
  };
  return (
    <div className={`flex items-center justify-between p-3 rounded-md ${colors[type as keyof typeof colors]}`}>
      <div className="flex items-center gap-2 text-sm">
        <Icon className="h-4 w-4 shrink-0" />
        <span>{text}</span>
      </div>
      <Button size="sm" variant="ghost" className="shrink-0 text-xs" asChild>
        <Link href={link}>{cta}</Link>
      </Button>
    </div>
  );
}

// ─── Page principale ───────────────────────────────────────────────────────────
export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState("semestre");

  return (
    <div className="p-6 space-y-8 bg-muted/20 min-h-screen">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Analytique</h1>
          <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2">
            <RefreshCw className="h-3 w-3" />
            Mis à jour le {new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filtre de période */}
          {["7j", "30j", "semestre", "année"].map(p => (
            <Button key={p} size="sm" variant={period === p ? "default" : "outline"} onClick={() => setPeriod(p)}>
              {p}
            </Button>
          ))}
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Centre d'alertes */}
      <Card className="border-amber-500/30">
        <CardHeader className="flex flex-row items-center gap-2 pb-2">
          <Bell className="h-5 w-5 text-amber-500" />
          <CardTitle className="text-base">Centre d'alertes ({ALERTS.length} anomalies détectées)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {ALERTS.map((alert, i) => <AlertBanner key={i} {...alert} />)}
        </CardContent>
      </Card>

      <Tabs defaultValue="membres">
        <TabsList className="mb-6">
          <TabsTrigger value="membres"><Users className="w-4 h-4 mr-2" />Membres & Assiduité</TabsTrigger>
          <TabsTrigger value="evenements"><CalendarDays className="w-4 h-4 mr-2" />Événements</TabsTrigger>
          <TabsTrigger value="sponsoring"><Wallet className="w-4 h-4 mr-2" />Sponsoring</TabsTrigger>
          <TabsTrigger value="performance"><Activity className="w-4 h-4 mr-2" />Performance</TabsTrigger>
        </TabsList>

        {/* ── Onglet Membres ── */}
        <TabsContent value="membres" className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard title="Membres Actifs" value="150" sub="10 nouveaux ce semestre" trend="+12.5% vs semestre préc." icon={Users} trendUp />
            <KpiCard title="Taux d'Assiduité" value="94%" sub="Seuil min : 70%" trend="+6pp vs semestre préc." icon={Activity} trendUp />
            <KpiCard title="Taux de Rétention" value="87%" sub="Sur 12 mois glissants" trend="-2pp vs an dernier" icon={TrendingUp} trendUp={false} />
            <KpiCard title="Membres à Risque" value="3" sub="Sous le seuil (70%)" trend="Alertes envoyées" icon={AlertTriangle} trendUp={false} />
          </div>

          <div className="grid md:grid-cols-7 gap-6">
            {/* Évolution membres + assiduité */}
            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle>Évolution du club</CardTitle>
                <CardDescription>Membres actifs et taux d'assiduité par mois</CardDescription>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={memberEvolution}>
                    <defs>
                      <linearGradient id="gActifs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00BCEB" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00BCEB" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gAssiduite" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00947A" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00947A" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="mois" tick={{ fontSize: 12, fill: "#888" }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 12, fill: "#888" }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: "#888" }} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Legend />
                    <Area yAxisId="left" type="monotone" dataKey="actifs" name="Membres actifs" stroke="#00BCEB" fill="url(#gActifs)" strokeWidth={2} />
                    <Area yAxisId="right" type="monotone" dataKey="assiduite" name="Assiduité (%)" stroke="#00947A" fill="url(#gAssiduite)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Répartition par cellule */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Répartition par Cellule</CardTitle>
                <CardDescription>Distribution des membres actifs</CardDescription>
              </CardHeader>
              <CardContent className="h-72 flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height="70%">
                  <PieChart>
                    <Pie data={cellDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                      {cellDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number, name: string) => [`${value} membres`, name]} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 w-full px-4">
                  {cellDistribution.map(c => (
                    <div key={c.name} className="flex items-center gap-2 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                      <span className="text-muted-foreground">{c.name}</span>
                      <span className="font-semibold ml-auto">{c.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top membres */}
          <Card>
            <CardHeader>
              <CardTitle>Top 5 membres — Implication</CardTitle>
              <CardDescription>Score composite : assiduité + livraison des tâches + participation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {topMembers.map((m, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="w-5 text-xs font-bold text-muted-foreground">{i + 1}</span>
                  <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">{m.name.charAt(0)}</AvatarFallback></Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <p className="text-sm font-medium">{m.name}</p>
                      <span className="text-sm font-bold tabular-nums">{m.score}%</span>
                    </div>
                    <Progress value={m.score} className="h-2" />
                  </div>
                  <Badge variant="outline" className="text-xs">{m.cell}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Onglet Événements ── */}
        <TabsContent value="evenements" className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard title="Événements organisés" value="5" sub="Ce semestre" trend="+2 vs sem. préc." icon={CalendarDays} trendUp />
            <KpiCard title="Total Inscrits" value="492" sub="Toutes sessions" trend="+31% vs sem. préc." icon={Users} trendUp />
            <KpiCard title="Taux de Présence" value="89%" sub="Présents / Inscrits" trend="+4pp vs sem. préc." icon={Activity} trendUp />
            <KpiCard title="Satisfaction Moy." value="4.6/5" sub="NPS Club : +42" trend="+0.3 vs sem. préc." icon={TrendingUp} trendUp />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Participation par événement</CardTitle>
              <CardDescription>Présents vs absents vs liste d'attente</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eventParticipation} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="event" tick={{ fontSize: 11, fill: "#888" }} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 12, fill: "#888" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="presents" name="Présents" fill="#00BCEB" radius={[4, 4, 0, 0]} stackId="a" />
                  <Bar dataKey="absents" name="Absents" fill="#ef4444" radius={[0, 0, 0, 0]} stackId="a" />
                  <Bar dataKey="attente" name="Liste d'attente" fill="#f59e0b" radius={[4, 4, 0, 0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Onglet Sponsoring ── */}
        <TabsContent value="sponsoring" className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard title="Levée de fonds" value="8,500 TND" sub="Objectif: 15,000 TND" trend="+3,000 TND vs M-1" icon={Wallet} trendUp />
            <KpiCard title="Pipeline pondéré" value="10,700 TND" sub="3 prospects actifs" trend="Σ(montant × probabilité)" icon={TrendingUp} trendUp />
            <KpiCard title="Sponsors Actifs" value="1" sub="+ 2 en négociation" trend="+1 vs sem. préc." icon={FileText} trendUp />
            <KpiCard title="Taux de conversion" value="33%" sub="Prospects → Signés" trend="-5pp (améliorer relances)" icon={Activity} trendUp={false} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Fonds levés vs Objectif cumulatif</CardTitle>
              <CardDescription>Progression mensuelle du sponsoring (en TND)</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sponsoringMonthly}>
                  <defs>
                    <linearGradient id="gObjectif" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D274D" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0D274D" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gLeve" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00BCEB" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#00BCEB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mois" tick={{ fontSize: 12, fill: "#888" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#888" }} tickFormatter={v => `${v / 1000}k`} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} formatter={(v: number) => [`${v.toLocaleString()} TND`]} />
                  <Legend />
                  <Area type="monotone" dataKey="objectif" name="Objectif cumulatif" stroke="#0D274D" fill="url(#gObjectif)" strokeDasharray="5 5" strokeWidth={2} />
                  <Area type="monotone" dataKey="leve" name="Montant levé" stroke="#00BCEB" fill="url(#gLeve)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Onglet Performance ── */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Radar de performance par cellule</CardTitle>
              <CardDescription>Score composite sur 5 critères (0-100)</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={cellRadar}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: "#888" }} />
                  <Radar name="Technique" dataKey="Technique" stroke="#00BCEB" fill="#00BCEB" fillOpacity={0.25} />
                  <Radar name="Événementiel" dataKey="Événementiel" stroke="#00947A" fill="#00947A" fillOpacity={0.25} />
                  <Radar name="Communication" dataKey="Com" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                  <Legend />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
