"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminShell } from "@/components/admin-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Briefcase, FileText, Plus, TrendingUp,
  Pencil, Trash2, X, AlertCircle, CheckCircle2,
  Globe, Tag, AlignLeft
} from "lucide-react";

type Sponsor = {
  id: string;
  name: string;
  logoUrl?: string | null;
  sector?: string | null;
  tier?: string | null;
  website?: string | null;
  status: string;
};

const TIERS = ["Platine", "Or", "Argent", "Bronze", "Média"];
const STAGES = [
  { key: "PROSPECT",    label: "Prospects",      color: "border-gray-500/30 bg-gray-500/5",   badge: "bg-gray-500/20 text-gray-400" },
  { key: "NEGOCIATION", label: "Négociation",     color: "border-amber-500/30 bg-amber-500/5", badge: "bg-amber-500/20 text-amber-400" },
  { key: "ACTIF",       label: "Actifs / Signés", color: "border-green-500/30 bg-green-500/5", badge: "bg-green-500/20 text-green-400" },
];
const TIER_COLORS: Record<string, string> = {
  Platine: "text-cyan-400 bg-cyan-500/20 border-cyan-500/30",
  Or:      "text-amber-400 bg-amber-500/20 border-amber-500/30",
  Argent:  "text-gray-400 bg-gray-500/20 border-gray-500/30",
  Bronze:  "text-orange-400 bg-orange-500/20 border-orange-500/30",
  Média:   "text-purple-400 bg-purple-500/20 border-purple-500/30",
};

const inputCls = "flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all";
const labelCls = "block text-sm font-medium text-gray-300 mb-1.5";

// ── Sponsor Form Modal ─────────────────────────────────────────────────────────
function SponsorModal({ sponsor, onClose, onSaved }: {
  sponsor?: Sponsor | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isEdit = !!sponsor;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const body = {
      name:    fd.get("name") as string,
      sector:  (fd.get("sector") as string) || undefined,
      tier:    (fd.get("tier") as string) || undefined,
      website: (fd.get("website") as string) || undefined,
      status:  fd.get("status") as string,
    };
    try {
      const url    = isEdit ? `/api/sponsors/${sponsor!.id}` : "/api/sponsors";
      const method = isEdit ? "PATCH" : "POST";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error(await res.text());
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || "Erreur serveur");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        className="relative z-10 w-full max-w-lg rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-bold text-white">{isEdit ? "Modifier le sponsor" : "Nouveau Sponsor"}</h2>
            <p className="text-sm text-gray-400 mt-0.5">{isEdit ? "Mettez à jour les informations" : "Ajoutez un nouveau partenaire"}</p>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0" />{error}
            </div>
          )}

          <div>
            <label className={labelCls}><AlignLeft className="inline h-3.5 w-3.5 mr-1" />Nom du sponsor *</label>
            <input name="name" required defaultValue={sponsor?.name} placeholder="Ex: Orange Tunisie" className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}><Tag className="inline h-3.5 w-3.5 mr-1" />Tier</label>
              <select name="tier" defaultValue={sponsor?.tier ?? ""} className={inputCls + " cursor-pointer bg-[#0a0a0a]"}>
                <option value="" className="bg-[#0a0a0a]">Aucun</option>
                {TIERS.map(t => <option key={t} value={t} className="bg-[#0a0a0a]">{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Statut</label>
              <select name="status" defaultValue={sponsor?.status ?? "PROSPECT"} className={inputCls + " cursor-pointer bg-[#0a0a0a]"}>
                {STAGES.map(s => <option key={s.key} value={s.key} className="bg-[#0a0a0a]">{s.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Secteur d&apos;activité</label>
            <input name="sector" defaultValue={sponsor?.sector ?? ""} placeholder="Ex: Télécommunications" className={inputCls} />
          </div>

          <div>
            <label className={labelCls}><Globe className="inline h-3.5 w-3.5 mr-1" />Site web</label>
            <input name="website" type="url" defaultValue={sponsor?.website ?? ""} placeholder="https://example.com" className={inputCls} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button type="button" variant="outline" onClick={onClose}
              className="rounded-xl border-white/20 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10">Annuler</Button>
            <Button type="submit" disabled={loading}
              className="bg-cyan-500 text-black hover:bg-cyan-400 font-bold rounded-xl px-8 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              {loading
                ? <span className="flex items-center gap-2"><span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin"/>Enregistrement...</span>
                : isEdit ? "Enregistrer" : "Créer le sponsor"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ── Delete Confirm Modal ───────────────────────────────────────────────────────
function DeleteModal({ sponsor, onClose, onDeleted }: { sponsor: Sponsor; onClose: () => void; onDeleted: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await fetch(`/api/sponsors/${sponsor.id}`, { method: "DELETE" });
    onDeleted();
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
        <h3 className="text-xl font-bold text-white mb-2">Supprimer le sponsor ?</h3>
        <p className="text-gray-400 text-sm mb-6">&laquo;{sponsor.name}&raquo; sera supprimé définitivement.</p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 rounded-xl border-white/20 bg-white/5 text-gray-300 hover:bg-white/10" onClick={onClose}>Annuler</Button>
          <Button disabled={loading} onClick={handleDelete} className="flex-1 bg-red-500 hover:bg-red-400 text-white font-bold rounded-xl">
            {loading ? "Suppression..." : "Supprimer"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function SponsoringPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<Sponsor | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Sponsor | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sponsors");
      const data = await res.json();
      setSponsors(Array.isArray(data) ? data : []);
    } catch {
      setSponsors([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <AdminShell title="Sponsoring & Partenariats" subtitle="Gérez le pipeline des sponsors et la documentation financière">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="space-y-8 max-w-7xl mx-auto pb-12">

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border text-sm font-medium ${
                toast.type === "success" ? "bg-green-500/20 border-green-500/40 text-green-300" : "bg-red-500/20 border-red-500/40 text-red-300"
              }`}>
              {toast.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              {toast.msg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action button */}
        <div className="flex justify-end">
          <Button onClick={() => setShowCreate(true)}
            className="bg-cyan-500 text-black hover:bg-cyan-400 font-bold rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]">
            <Plus className="mr-2 h-4 w-4" /> Nouveau Sponsor
          </Button>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Briefcase, label: "Total Sponsors", value: String(sponsors.length), sub: `${sponsors.filter(s => s.status === "ACTIF").length} actifs`, color: "cyan" },
            { icon: TrendingUp, label: "En Négociation",  value: String(sponsors.filter(s => s.status === "NEGOCIATION").length), sub: "Deals en cours", color: "amber" },
            { icon: FileText,   label: "Prospects",       value: String(sponsors.filter(s => s.status === "PROSPECT").length), sub: "À qualifier", color: "purple" },
          ].map(({ icon: Icon, label, value, sub, color }) => (
            <Card key={label} className="bg-white/5 border-white/10 backdrop-blur-md hover:border-white/20 transition-all">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{label}</p>
                    <p className={`text-3xl font-extrabold ${color === "cyan" ? "text-cyan-400" : color === "amber" ? "text-amber-400" : "text-purple-400"}`}>{value}</p>
                    <p className="text-xs text-gray-500 mt-1">{sub}</p>
                  </div>
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${color === "cyan" ? "bg-cyan-500/10 text-cyan-400" : color === "amber" ? "bg-amber-500/10 text-amber-400" : "bg-purple-500/10 text-purple-400"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Kanban */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="h-10 w-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Kanban Pipeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STAGES.map(stage => {
                const cards = sponsors.filter(s => s.status === stage.key);
                return (
                  <div key={stage.key} className={`flex flex-col rounded-2xl p-4 border ${stage.color}`}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-white">{stage.label}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${stage.badge}`}>{cards.length}</span>
                    </div>
                    <div className="space-y-3">
                      {cards.map(sponsor => (
                        <div key={sponsor.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-white">{sponsor.name}</h4>
                            {sponsor.tier && (
                              <Badge className={`border text-xs ${TIER_COLORS[sponsor.tier] ?? "text-gray-400 bg-gray-500/20"}`}>
                                {sponsor.tier}
                              </Badge>
                            )}
                          </div>
                          {sponsor.sector && <p className="text-xs text-gray-400 mb-1"><Tag className="inline h-3 w-3 mr-1" />{sponsor.sector}</p>}
                          {sponsor.website && (
                            <a href={sponsor.website} target="_blank" rel="noopener noreferrer"
                              className="flex items-center text-xs text-cyan-400 hover:text-cyan-300 gap-1 mb-1 truncate">
                              <Globe className="h-3 w-3 shrink-0" />{sponsor.website.replace(/^https?:\/\//, "")}
                            </a>
                          )}
                          <div className="flex gap-2 mt-3 pt-3 border-t border-white/10">
                            <button onClick={() => setEditTarget(sponsor)}
                              className="flex-1 flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded-lg py-1.5 transition-all">
                              <Pencil className="h-3.5 w-3.5" />Modifier
                            </button>
                            <button onClick={() => setDeleteTarget(sponsor)}
                              className="flex-1 flex items-center justify-center gap-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg py-1.5 transition-all">
                              <Trash2 className="h-3.5 w-3.5" />Supprimer
                            </button>
                          </div>
                        </div>
                      ))}
                      {cards.length === 0 && (
                        <div className="border border-dashed border-white/10 rounded-xl p-8 text-center text-gray-500 text-sm">
                          Aucun sponsor
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {(showCreate || editTarget) && (
          <SponsorModal key="sponsor-modal" sponsor={editTarget}
            onClose={() => { setShowCreate(false); setEditTarget(null); }}
            onSaved={() => { load(); showToast(editTarget ? "Sponsor modifié !" : "Sponsor créé !"); }} />
        )}
        {deleteTarget && (
          <DeleteModal key="delete-modal" sponsor={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onDeleted={() => { load(); showToast("Sponsor supprimé.", "error"); }} />
        )}
      </AnimatePresence>
    </AdminShell>
  );
}
