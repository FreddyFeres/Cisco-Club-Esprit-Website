"use client";

import { useState, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, CheckCircle2, XCircle, Search, Users, UserCheck, Clock, UserX } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminShell } from "@/components/admin-shell";
import {
  getEventsWithAttendance,
  getAttendanceForEvent,
  upsertAttendance,
  bulkCreateAttendance,
} from "@/actions/stats";
import { getUsers } from "@/actions/users";

const STATUS_CFG: Record<string, { label: string; cls: string }> = {
  PRESENT: { label: "Présent",   cls: "bg-green-500/20 text-green-400 border-green-500/30" },
  ABSENT:  { label: "Absent",    cls: "bg-red-500/20 text-red-400 border-red-500/30" },
  RETARD:  { label: "En retard", cls: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  EXCUSE:  { label: "Excusé",    cls: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
};

export default function AttendancePage() {
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [attendance, setAttendance] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  const [scanResult, setScanResult] = useState<"idle" | "success" | "error">("idle");
  const [isPending, startTransition] = useTransition();

  // Load events + users on mount
  useEffect(() => {
    Promise.all([getEventsWithAttendance(), getUsers()]).then(([ev, users]) => {
      setEvents(ev);
      setAllUsers(users);
      if (ev.length > 0) setSelectedEventId(ev[0].id);
      setLoadingData(false);
    });
  }, []);

  // Load attendance when event changes
  useEffect(() => {
    if (!selectedEventId) return;
    getAttendanceForEvent(selectedEventId).then(att => setAttendance(att));
  }, [selectedEventId]);

  const handleInitSession = () => {
    if (!selectedEventId) return;
    startTransition(async () => {
      const userIds = allUsers.map((u: any) => u.id);
      await bulkCreateAttendance(selectedEventId, userIds);
      const fresh = await getAttendanceForEvent(selectedEventId);
      setAttendance(fresh);
      import("sonner").then(({ toast }) => toast.success("Session de pointage initialisée"));
    });
  };

  const handleSetStatus = (userId: string, status: "PRESENT" | "ABSENT" | "RETARD" | "EXCUSE") => {
    startTransition(async () => {
      const method = status === "PRESENT" ? "MANUAL" : "MANUAL";
      await upsertAttendance(selectedEventId, userId, status, method);
      // Optimistic update
      setAttendance(prev => {
        const exists = prev.find((a: any) => a.userId === userId);
        if (exists) return prev.map((a: any) => a.userId === userId ? { ...a, status, method } : a);
        return [...prev, { userId, status, method, user: allUsers.find((u: any) => u.id === userId) }];
      });
      import("sonner").then(({ toast }) => toast.success(`Statut mis à jour`));
    });
  };

  const simulateScan = (result: "success" | "error") => {
    setScanResult(result);
    if (result === "success" && attendance.length > 0) {
      // Mark first ABSENT user as PRESENT for demo
      const absent = attendance.find((a: any) => a.status === "ABSENT");
      if (absent) handleSetStatus(absent.userId, "PRESENT");
    }
    setTimeout(() => setScanResult("idle"), 3000);
  };

  const filtered = attendance.filter((a: any) => {
    const name = a.user ? `${a.user.firstName} ${a.user.lastName}` : "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const counts = {
    present: attendance.filter((a: any) => a.status === "PRESENT").length,
    absent:  attendance.filter((a: any) => a.status === "ABSENT").length,
    retard:  attendance.filter((a: any) => a.status === "RETARD").length,
    excuse:  attendance.filter((a: any) => a.status === "EXCUSE").length,
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);

  return (
    <AdminShell
      title="Pointage & Assiduité"
      subtitle={selectedEvent ? `Événement : ${selectedEvent.title}` : "Sélectionnez un événement"}
    >
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="space-y-8 max-w-7xl mx-auto pb-12">

        {/* Event Selector */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-400 shrink-0">Événement :</label>
            <select
              value={selectedEventId}
              onChange={e => setSelectedEventId(e.target.value)}
              className="h-10 rounded-xl border border-white/10 bg-black/40 px-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 min-w-[280px]"
            >
              {events.length === 0
                ? <option value="">Aucun événement disponible</option>
                : events.map(ev => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} — {new Date(ev.startDate).toLocaleDateString("fr-FR")}
                  </option>
                ))
              }
            </select>
          </div>
          <div className="flex gap-3">
            {attendance.length === 0 && selectedEventId && (
              <Button onClick={handleInitSession} disabled={isPending}
                className="rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 font-semibold gap-2">
                {isPending ? "Initialisation..." : "Initialiser la session de pointage"}
              </Button>
            )}
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: UserCheck, label: "Présents",  value: counts.present, color: "green" },
            { icon: UserX,     label: "Absents",   value: counts.absent,  color: "red" },
            { icon: Clock,     label: "En retard", value: counts.retard,  color: "amber" },
            { icon: Users,     label: "Excusés",   value: counts.excuse,  color: "gray" },
          ].map(({ icon: Icon, label, value, color }) => (
            <Card key={label} className="bg-white/5 border-white/10 backdrop-blur-md hover:border-white/20 transition-all">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">{label}</p>
                    <p className={`text-3xl font-black ${
                      color === "green" ? "text-green-400" :
                      color === "red"   ? "text-red-400"   :
                      color === "amber" ? "text-amber-400" : "text-gray-400"
                    }`}>{value}</p>
                  </div>
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    color === "green" ? "bg-green-500/10 text-green-400" :
                    color === "red"   ? "bg-red-500/10 text-red-400"     :
                    color === "amber" ? "bg-amber-500/10 text-amber-400" : "bg-gray-500/10 text-gray-400"
                  }`}><Icon className="h-5 w-5" /></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full max-w-sm grid-cols-2 bg-white/5 border border-white/10 rounded-xl p-1">
            <TabsTrigger value="scan" className="rounded-lg data-[state=active]:bg-cyan-500 data-[state=active]:text-black font-semibold">
              <QrCode className="h-4 w-4 mr-2" /> Scan QR
            </TabsTrigger>
            <TabsTrigger value="list" className="rounded-lg data-[state=active]:bg-cyan-500 data-[state=active]:text-black font-semibold">
              <Users className="h-4 w-4 mr-2" /> Feuille d&apos;appel
            </TabsTrigger>
          </TabsList>

          {/* QR Scan */}
          <TabsContent value="scan" className="mt-6">
            <div className="max-w-lg mx-auto">
              <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-white">Scanner un participant</CardTitle>
                  <CardDescription className="text-gray-400">
                    Demandez aux membres de présenter leur QR Code
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center py-10 gap-6">
                  <div className="relative h-64 w-64">
                    <div className="absolute inset-0 bg-black/40 border-2 border-white/10 rounded-2xl flex items-center justify-center">
                      <QrCode className="h-24 w-24 text-white/20" />
                    </div>
                    <div className="absolute top-0 left-0 h-8 w-8 border-t-4 border-l-4 border-cyan-400 rounded-tl-lg" />
                    <div className="absolute top-0 right-0 h-8 w-8 border-t-4 border-r-4 border-cyan-400 rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 h-8 w-8 border-b-4 border-l-4 border-cyan-400 rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 h-8 w-8 border-b-4 border-r-4 border-cyan-400 rounded-br-lg" />
                    <div className="absolute top-4 left-4 right-4 h-0.5 bg-cyan-400/60 animate-bounce" />
                    <AnimatePresence>
                      {scanResult !== "idle" && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                          className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl gap-2 ${
                            scanResult === "success" ? "bg-green-500/30 border-2 border-green-400" : "bg-red-500/30 border-2 border-red-400"
                          }`}
                        >
                          {scanResult === "success" ? <CheckCircle2 className="h-16 w-16 text-green-400" /> : <XCircle className="h-16 w-16 text-red-400" />}
                          <p className={`text-sm font-bold ${scanResult === "success" ? "text-green-300" : "text-red-300"}`}>
                            {scanResult === "success" ? "Présence enregistrée !" : "QR Code invalide"}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {scanResult === "idle" && (
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      <span className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse" /> En attente de scan...
                    </p>
                  )}
                  <div className="flex gap-3">
                    <Button onClick={() => simulateScan("success")} className="rounded-xl bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500 hover:text-white gap-2">
                      <CheckCircle2 className="h-4 w-4" /> Simuler Succès
                    </Button>
                    <Button onClick={() => simulateScan("error")} className="rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white gap-2">
                      <XCircle className="h-4 w-4" /> Simuler Erreur
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* List */}
          <TabsContent value="list" className="mt-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-white">Registre des présences</CardTitle>
                    <CardDescription className="text-gray-400">
                      {attendance.length} enregistrements · Cliquez sur P/A/R/E pour modifier
                    </CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                      placeholder="Chercher un membre..."
                      className="h-10 w-[240px] rounded-xl border border-white/10 bg-white/5 px-3 pl-9 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loadingData ? (
                  <div className="flex justify-center py-12">
                    <div className="h-8 w-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : attendance.length === 0 ? (
                  <div className="border border-dashed border-white/10 rounded-xl p-10 text-center">
                    <p className="text-gray-400 mb-4">Aucune session initialisée pour cet événement.</p>
                    <Button onClick={handleInitSession} disabled={isPending || !selectedEventId}
                      className="bg-cyan-500 text-black hover:bg-cyan-400 rounded-xl font-semibold">
                      Initialiser le pointage
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-gray-400">Participant</TableHead>
                        <TableHead className="text-gray-400">Rôle</TableHead>
                        <TableHead className="text-gray-400">Statut</TableHead>
                        <TableHead className="text-gray-400">Méthode</TableHead>
                        <TableHead className="text-right text-gray-400">Marquer</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((att: any) => {
                        const name = att.user ? `${att.user.firstName} ${att.user.lastName}` : att.userId;
                        return (
                          <TableRow key={att.userId} className="border-white/10 hover:bg-white/5 transition-colors">
                            <TableCell className="font-semibold text-white">{name}</TableCell>
                            <TableCell>
                              <Badge className="bg-white/10 text-gray-300 border-0 text-xs font-mono">{att.user?.role ?? "—"}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={`border text-xs font-semibold ${STATUS_CFG[att.status]?.cls}`}>
                                {STATUS_CFG[att.status]?.label ?? att.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-400 text-sm">{att.method ?? "—"}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                {(["PRESENT", "ABSENT", "RETARD", "EXCUSE"] as const).map((s) => (
                                  <button key={s} onClick={() => handleSetStatus(att.userId, s)} title={STATUS_CFG[s].label}
                                    className={`h-8 w-8 rounded-lg border transition-all text-xs font-bold ${
                                      att.status === s
                                        ? s === "PRESENT" ? "bg-green-500 text-white border-green-500"
                                          : s === "ABSENT" ? "bg-red-500 text-white border-red-500"
                                          : s === "RETARD" ? "bg-amber-500 text-white border-amber-500"
                                          : "bg-gray-500 text-white border-gray-500"
                                        : s === "PRESENT" ? "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500 hover:text-white"
                                          : s === "ABSENT" ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500 hover:text-white"
                                          : s === "RETARD" ? "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500 hover:text-white"
                                          : "bg-gray-500/10 text-gray-400 border-gray-500/20 hover:bg-gray-500 hover:text-white"
                                    }`}
                                  >
                                    {s[0]}
                                  </button>
                                ))}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </AdminShell>
  );
}
