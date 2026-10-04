"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminShell } from "@/components/admin-shell";
import { getEvents, createEvent, updateEvent, deleteEvent } from "@/actions/events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Plus, Pencil, Trash2, CalendarDays, MapPin, Users, X,
  AlertCircle, CheckCircle2, Clock, Tag, Wallet, AlignLeft
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────
type Event = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  capacity: number;
  budget?: number | null;
  status: string;
  startDate: Date | string;
  endDate: Date | string;
  coverUrl?: string | null;
};

// ── Constants ──────────────────────────────────────────────────────
const CATEGORIES = ["Formation", "Conférence", "Compétition", "Atelier", "Social", "Autre"];
const STATUSES = [
  { value: "BROUILLON", label: "Brouillon", cls: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
  { value: "PUBLIE",    label: "Publié",    cls: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  { value: "COMPLET",   label: "Complet",   cls: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  { value: "TERMINE",   label: "Terminé",   cls: "bg-green-500/20 text-green-400 border-green-500/30" },
  { value: "ANNULE",    label: "Annulé",    cls: "bg-red-500/20 text-red-400 border-red-500/30" },
];

const inputCls = "flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all";
const labelCls = "block text-sm font-medium text-gray-300 mb-1.5";

// ── Helpers ────────────────────────────────────────────────────────
function toLocalDatetimeInput(d: Date | string) {
  const date = new Date(d);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUSES.find(s => s.value === status) ?? STATUSES[0];
  return <Badge className={`border text-xs font-semibold ${s.cls}`}>{s.label}</Badge>;
}

// ── Event Form Modal ────────────────────────────────────────────────
function EventModal({
  event,
  onClose,
  onSaved,
}: {
  event?: Event | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isEdit = !!event;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);

    const res = isEdit
      ? await updateEvent(event!.id, formData)
      : await createEvent(formData);

    if ("error" in res && res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      onSaved();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl"
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-white">
              {isEdit ? "Modifier l'événement" : "Nouvel Événement"}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {isEdit ? "Modifiez les informations et sauvegardez" : "Remplissez le formulaire pour créer un événement"}
            </p>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0" />
              {error}
            </div>
          )}

          {/* Title and Cover */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}><AlignLeft className="inline h-3.5 w-3.5 mr-1" />Titre *</label>
              <input name="title" required defaultValue={event?.title} placeholder="Bootcamp CCNA — Module 1" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Affiche / Photo (Optionnel)</label>
              <input type="file" name="cover" accept="image/*" className={inputCls + " file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-black hover:file:bg-cyan-400"} />
              {event?.coverUrl && <p className="text-xs text-cyan-400 mt-1">Image actuelle : {event.coverUrl.split('/').pop()}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description *</label>
            <textarea
              name="description"
              required
              rows={4}
              defaultValue={event?.description}
              placeholder="Décrivez l'événement, le programme, les prérequis..."
              className={inputCls + " resize-none h-auto py-3"}
            />
          </div>

          {/* Category + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}><Tag className="inline h-3.5 w-3.5 mr-1" />Catégorie *</label>
              <select name="category" required defaultValue={event?.category ?? ""} className={inputCls + " cursor-pointer bg-[#0a0a0a]"}>
                <option value="" disabled className="bg-[#0a0a0a]">Choisir...</option>
                {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0a0a0a]">{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Statut</label>
              <select name="status" defaultValue={event?.status ?? "BROUILLON"} className={inputCls + " cursor-pointer bg-[#0a0a0a]"}>
                {STATUSES.map(s => <option key={s.value} value={s.value} className="bg-[#0a0a0a]">{s.label}</option>)}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}><CalendarDays className="inline h-3.5 w-3.5 mr-1" />Date de début *</label>
              <input
                name="startDate"
                type="datetime-local"
                required
                defaultValue={event ? toLocalDatetimeInput(event.startDate) : ""}
                className={inputCls + " [color-scheme:dark]"}
              />
            </div>
            <div>
              <label className={labelCls}><Clock className="inline h-3.5 w-3.5 mr-1" />Date de fin *</label>
              <input
                name="endDate"
                type="datetime-local"
                required
                defaultValue={event ? toLocalDatetimeInput(event.endDate) : ""}
                className={inputCls + " [color-scheme:dark]"}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className={labelCls}><MapPin className="inline h-3.5 w-3.5 mr-1" />Lieu *</label>
            <input name="location" required defaultValue={event?.location} placeholder="Ex: Salle 04 — Bâtiment C, ESPRIT" className={inputCls} />
          </div>

          {/* Capacity + Budget */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}><Users className="inline h-3.5 w-3.5 mr-1" />Capacité *</label>
              <input name="capacity" type="number" required min={1} defaultValue={event?.capacity ?? 30} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}><Wallet className="inline h-3.5 w-3.5 mr-1" />Budget (TND)</label>
              <input name="budget" type="number" min={0} step="0.01" defaultValue={event?.budget ?? ""} placeholder="Optionnel" className={inputCls} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button type="button" variant="outline" onClick={onClose}
              className="rounded-xl border-white/20 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10">
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-cyan-500 text-black hover:bg-cyan-400 font-bold rounded-xl px-8 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Enregistrement...
                </span>
              ) : isEdit ? "Enregistrer" : "Créer l'événement"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ── Delete Confirm Modal ────────────────────────────────────────────
function DeleteModal({ event, onClose, onDeleted }: { event: Event; onClose: () => void; onDeleted: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const res = await deleteEvent(event.id);
    if ("success" in res) onDeleted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="relative z-10 w-full max-w-md rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl p-8 text-center">
        <div className="h-14 w-14 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-5">
          <Trash2 className="h-7 w-7 text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Supprimer l&apos;événement ?</h3>
        <p className="text-gray-400 text-sm mb-6">
          &laquo;{event.title}&raquo; sera supprimé définitivement avec toutes ses inscriptions et présences.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 rounded-xl border-white/20 bg-white/5 text-gray-300 hover:bg-white/10" onClick={onClose}>
            Annuler
          </Button>
          <Button
            disabled={loading}
            onClick={handleDelete}
            className="flex-1 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl"
          >
            {loading ? "Suppression..." : "Supprimer"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────
export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [filterStatus, setFilterStatus] = useState("ALL");

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getEvents();
    setEvents(data as Event[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const filtered = filterStatus === "ALL" ? events : events.filter(e => e.status === filterStatus);

  return (
    <AdminShell title="Gestion des Événements" subtitle="Créez, modifiez et supprimez les événements du club">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-8 pb-12">

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border text-sm font-medium ${
                toast.type === "success"
                  ? "bg-green-500/20 border-green-500/40 text-green-300"
                  : "bg-red-500/20 border-red-500/40 text-red-300"
              }`}
            >
              {toast.type === "success"
                ? <CheckCircle2 className="h-5 w-5" />
                : <AlertCircle className="h-5 w-5" />}
              {toast.msg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus("ALL")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterStatus === "ALL" ? "bg-cyan-500 text-black font-bold" : "bg-white/5 text-gray-400 hover:text-white border border-white/10"}`}
            >
              Tous ({events.length})
            </button>
            {STATUSES.map(s => {
              const count = events.filter(e => e.status === s.value).length;
              return (
                <button key={s.value}
                  onClick={() => setFilterStatus(s.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterStatus === s.value ? "bg-cyan-500 text-black font-bold" : "bg-white/5 text-gray-400 hover:text-white border border-white/10"}`}
                >
                  {s.label} ({count})
                </button>
              );
            })}
          </div>

          <Button
            onClick={() => setShowCreate(true)}
            className="bg-cyan-500 text-black hover:bg-cyan-400 font-bold rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all"
          >
            <Plus className="mr-2 h-5 w-5" /> Nouvel Événement
          </Button>
        </div>

        {/* Events grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="h-10 w-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardContent className="py-20 text-center">
              <CalendarDays className="h-14 w-14 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Aucun événement</h3>
              <p className="text-gray-400 text-sm mb-6">Commencez par créer votre premier événement.</p>
              <Button onClick={() => setShowCreate(true)} className="bg-cyan-500 text-black hover:bg-cyan-400 font-bold rounded-xl">
                <Plus className="mr-2 h-4 w-4" /> Créer un événement
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.map((event, i) => {
                const start = new Date(event.startDate);
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Card className="h-full flex flex-col bg-white/5 border-white/10 backdrop-blur-md hover:border-white/20 transition-all group">
                      {/* Category strip */}
                      <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-t-xl opacity-60 group-hover:opacity-100 transition-opacity" />

                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <StatusBadge status={event.status} />
                          <Badge className="bg-white/10 text-gray-300 border-0 text-xs">{event.category}</Badge>
                        </div>
                        <CardTitle className="text-white text-lg leading-snug group-hover:text-cyan-400 transition-colors">
                          {event.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="flex-1 space-y-2.5 text-sm text-gray-400">
                        <p className="line-clamp-2 text-gray-400 leading-relaxed">{event.description}</p>
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-gray-500 shrink-0" />
                            <span>{start.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500 shrink-0" />
                            <span>{start.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500 shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-500 shrink-0" />
                            <span>Capacité : <span className="font-bold text-white">{event.capacity}</span> personnes</span>
                          </div>
                          {event.budget != null && (
                            <div className="flex items-center gap-2">
                              <Wallet className="h-4 w-4 text-gray-500 shrink-0" />
                              <span>Budget : <span className="font-bold text-white">{event.budget.toLocaleString()} TND</span></span>
                            </div>
                          )}
                          {event.coverUrl && (
                            <div className="flex items-center gap-2 mt-2">
                              <img src={event.coverUrl} alt={event.title} className="h-12 w-12 object-cover rounded-md border border-white/10" />
                            </div>
                          )}
                        </div>
                      </CardContent>

                      {/* Action footer */}
                      <div className="flex gap-2 px-6 pb-5 pt-3 border-t border-white/10">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditEvent(event)}
                          className="flex-1 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl text-xs"
                        >
                          <Pencil className="h-3.5 w-3.5 mr-1.5" /> Modifier
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteTarget(event)}
                          className="flex-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl text-xs"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Supprimer
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {(showCreate || editEvent) && (
          <EventModal
            key="event-modal"
            event={editEvent}
            onClose={() => { setShowCreate(false); setEditEvent(null); }}
            onSaved={() => { load(); showToast(editEvent ? "Événement modifié !" : "Événement créé !"); }}
          />
        )}
        {deleteTarget && (
          <DeleteModal
            key="delete-modal"
            event={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onDeleted={() => { load(); showToast("Événement supprimé.", "error"); }}
          />
        )}
      </AnimatePresence>
    </AdminShell>
  );
}
