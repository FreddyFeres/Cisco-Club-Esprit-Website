"use client";

import { useState, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Plus, Users, Video, Trash2, X, AlertCircle } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { getMeetings, deleteMeeting, createMeeting } from "@/actions/meetings";
import { getUsers } from "@/actions/users";

const TYPE_COLORS: Record<string, string> = {
  "Bureau Exécutif": "text-cyan-400 bg-cyan-500/20 border-cyan-500/30",
  "Cellule Technique": "text-purple-400 bg-purple-500/20 border-purple-500/30",
  "Cellule Sponsoring": "text-amber-400 bg-amber-500/20 border-amber-500/30",
};

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    title: "",
    type: "Bureau Exécutif",
    date: "",
    time: "",
    duration: 60,
    location: "",
    objective: "",
    organizerId: ""
  });

  const loadData = async () => {
    setLoading(true);
    const [m, u] = await Promise.all([getMeetings(), getUsers()]);
    setMeetings(m);
    setUsers(u);
    if (u.length > 0) setForm(f => ({ ...f, organizerId: u[0].id }));
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette réunion ?")) return;
    startTransition(async () => {
      const res = await deleteMeeting(id);
      if (res.success) {
        setMeetings(meetings.filter(m => m.id !== id));
        import('sonner').then(({ toast }) => toast.success('Réunion supprimée'));
      } else {
        import('sonner').then(({ toast }) => toast.error('Erreur', { description: res.error }));
      }
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const startDate = new Date(`${form.date}T${form.time}`);
      const res = await createMeeting({
        title: form.title,
        type: form.type,
        startDate,
        duration: Number(form.duration),
        location: form.location,
        objective: form.objective,
        organizerId: form.organizerId
      }, []); // no participants initially
      if (res.success) {
        loadData();
        setShowCreate(false);
        import('sonner').then(({ toast }) => toast.success('Réunion créée avec succès'));
      } else {
        import('sonner').then(({ toast }) => toast.error('Erreur', { description: res.error }));
      }
    });
  };

  return (
    <AdminShell title="Réunions Internes" subtitle="Ordre du jour, comptes-rendus et plans d'action">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8 max-w-7xl mx-auto pb-12">

        {/* Header Action */}
        <div className="flex justify-end">
          <Button 
            className="bg-cyan-500 text-black hover:bg-cyan-400 font-semibold rounded-xl"
            onClick={() => setShowCreate(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Nouvelle Réunion
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="h-8 w-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetings.map((meeting, i) => (
              <motion.div
                key={meeting.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className="relative h-full flex flex-col bg-white/5 border-white/10 backdrop-blur-md hover:border-cyan-500/40 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                  <button 
                    onClick={(e) => { e.preventDefault(); handleDelete(meeting.id); }}
                    className="absolute top-4 right-4 z-10 h-8 w-8 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <Link href={`/admin/meetings/${meeting.id}`} className="block h-full group">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-3">
                        <Badge className={`border text-xs font-semibold ${TYPE_COLORS[meeting.type] ?? "text-gray-400 bg-gray-500/20"}`}>
                          {meeting.type}
                        </Badge>
                        {new Date(meeting.startDate) > new Date() ? (
                          <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs">À venir</Badge>
                        ) : (
                          <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs">Terminée</Badge>
                        )}
                      </div>
                      <CardTitle className="text-white text-lg group-hover:text-cyan-400 transition-colors pr-8">
                        {meeting.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-3 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{new Date(meeting.startDate).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{new Date(meeting.startDate).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} <span className="text-gray-500">({meeting.duration} min)</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        {meeting.location.includes("Meet") || meeting.location.includes("Teams") ? (
                          <Video className="h-4 w-4 text-gray-500" />
                        ) : (
                          <MapPin className="h-4 w-4 text-gray-500" />
                        )}
                        <span>{meeting.location}</span>
                      </div>
                      <div className="flex items-center gap-2 pt-3 mt-3 border-t border-white/10">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span><span className="font-bold text-white">{meeting.participants?.length || 0}</span> participants invités</span>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              </motion.div>
            ))}
            {meetings.length === 0 && (
              <div className="col-span-full border border-dashed border-white/10 rounded-xl p-12 text-center text-gray-500">
                Aucune réunion planifiée
              </div>
            )}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
              <button onClick={() => setShowCreate(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
              <h3 className="text-xl font-bold text-white mb-6">Planifier une réunion</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 font-medium block mb-1.5">Titre *</label>
                  <input required type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 font-medium block mb-1.5">Date *</label>
                    <input required type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 [color-scheme:dark]" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 font-medium block mb-1.5">Heure *</label>
                    <input required type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="w-full h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 [color-scheme:dark]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 font-medium block mb-1.5">Durée (min) *</label>
                    <input required type="number" min="15" step="15" value={form.duration} onChange={e => setForm({...form, duration: Number(e.target.value)})} className="w-full h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 font-medium block mb-1.5">Type *</label>
                    <select required value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full h-10 rounded-xl border border-white/10 bg-black px-3 text-sm text-white focus:outline-none focus:border-cyan-500/50">
                      <option value="Bureau Exécutif">Bureau Exécutif</option>
                      <option value="Cellule Technique">Cellule Technique</option>
                      <option value="Cellule Sponsoring">Cellule Sponsoring</option>
                      <option value="Générale">Générale</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 font-medium block mb-1.5">Lieu / Lien *</label>
                  <input required type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 font-medium block mb-1.5">Objectif</label>
                  <textarea value={form.objective} onChange={e => setForm({...form, objective: e.target.value})} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 min-h-[80px]" />
                </div>
                <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                  <Button type="button" variant="outline" onClick={() => setShowCreate(false)} className="rounded-xl border-white/10 bg-transparent text-gray-400 hover:text-white">Annuler</Button>
                  <Button type="submit" disabled={isPending} className="rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 font-semibold">{isPending ? "Création..." : "Créer"}</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminShell>
  );
}
