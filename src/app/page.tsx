"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users, CalendarDays, Wallet, TrendingUp, Presentation,
  ArrowUpRight, ArrowDownRight, Activity, Bell, AlertTriangle,
  BarChart2
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

export default function Dashboard() {
  return (
    <div className="flex min-h-screen w-full bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b">
          <div className="font-bold text-xl text-primary flex items-center gap-2">
            <Activity className="h-6 w-6" />
            Cisco Club
          </div>
        </div>
        <div className="flex-1 py-6 px-4 space-y-2">
          <Button variant="secondary" className="w-full justify-start" asChild>
            <Link href="/">
              <TrendingUp className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" asChild>
            <Link href="/admin/analytics">
              <BarChart2 className="mr-2 h-4 w-4" />
              Analytics Complet
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" asChild>
            <Link href="/admin/rh">
              <Users className="mr-2 h-4 w-4" />
              Membres & RH
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" asChild>
            <Link href="/events">
              <CalendarDays className="mr-2 h-4 w-4" />
              Événements
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" asChild>
            <Link href="/admin/sponsors">
              <Wallet className="mr-2 h-4 w-4" />
              Sponsoring
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" asChild>
            <Link href="/admin/meetings">
              <Presentation className="mr-2 h-4 w-4" />
              Réunions
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" asChild>
            <Link href="/admin/attendance">
              <Activity className="mr-2 h-4 w-4" />
              Pointage
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="h-16 flex items-center justify-between px-8 border-b bg-card">
          <h1 className="font-semibold text-lg">Vue d'ensemble — Bureau Exécutif</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/analytics">Analytics complet</Link>
            </Button>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Alertes rapides */}
          <div className="space-y-2">
            {ALERTS.map((a, i) => (
              <div key={i} className={`flex items-center gap-2 p-3 rounded-md text-sm border-l-4 ${
                a.type === "danger" ? "border-l-destructive bg-destructive/10" :
                a.type === "warning" ? "border-l-amber-500 bg-amber-500/10" :
                "border-l-primary bg-primary/10"
              }`}>
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {a.text}
              </div>
            ))}
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="members">Membres</TabsTrigger>
              <TabsTrigger value="events">Événements</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* KPI Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Membres Actifs</CardTitle>
                    <Users className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold tabular-nums">150</div>
                    <p className="text-xs text-green-500 flex items-center mt-1">
                      <ArrowUpRight className="h-3 w-3 mr-1" />+12% vs semestre préc.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Taux d'assiduité</CardTitle>
                    <Activity className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold tabular-nums">94%</div>
                    <p className="text-xs text-green-500 flex items-center mt-1">
                      <ArrowUpRight className="h-3 w-3 mr-1" />+6pp vs semestre préc.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Fonds Levés</CardTitle>
                    <Wallet className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold tabular-nums">8,500 TND</div>
                    <Progress value={57} className="mt-2 h-1.5" />
                    <p className="text-xs text-muted-foreground mt-1">57% de l'objectif annuel</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Remplissage Événements</CardTitle>
                    <CalendarDays className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold tabular-nums">89%</div>
                    <p className="text-xs text-green-500 flex items-center mt-1">
                      <ArrowUpRight className="h-3 w-3 mr-1" />Taux de présence
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid gap-6 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Évolution de l'assiduité</CardTitle>
                    <CardDescription>Taux mensuel sur la saison 2024-2025</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dataAssiduite} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorAssiduite" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00BCEB" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#00BCEB" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} domain={[60, 100]} />
                        <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                        <Area type="monotone" dataKey="assiduite" name="Assiduité (%)" stroke="#00BCEB" strokeWidth={2} fillOpacity={1} fill="url(#colorAssiduite)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Pipeline Sponsoring</CardTitle>
                    <CardDescription>Montants estimés par prospect</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-5 mt-2">
                      {dataSponsoring.map((sponsor, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-medium">{sponsor.name}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant={sponsor.status === "Actif" ? "default" : "outline"} className="text-[10px] h-4">
                                {sponsor.status}
                              </Badge>
                              <span className="font-semibold text-sm tabular-nums">{sponsor.amount.toLocaleString()} TND</span>
                            </div>
                          </div>
                          <Progress value={Math.round(sponsor.amount / 50)} className="h-1.5" />
                        </div>
                      ))}
                    </div>
                    <Button className="w-full mt-6" variant="outline" size="sm" asChild>
                      <Link href="/admin/sponsors">Voir le kanban complet →</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="members" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-sm">Accédez à la vue détaillée dans le module RH.</p>
                  <Button className="mt-4" asChild>
                    <Link href="/admin/rh">Ouvrir le module RH</Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-sm">Accédez à la liste des événements et au pointage.</p>
                  <div className="flex gap-3 mt-4">
                    <Button asChild><Link href="/events">Événements publics</Link></Button>
                    <Button variant="outline" asChild><Link href="/admin/attendance">Pointage</Link></Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
