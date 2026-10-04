"use client";

import { useState, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, Search, UserPlus, Users, Clock, FolderArchive, Trash2, X } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { getMembers, deleteMember, createMember, createNewMemberManually, getCells } from "@/actions/rh";
import { getUsers } from "@/actions/users";

const STATUS_CONFIG: Record<string, { label: string; class: string }> = {
  ACTIF: { label: "Actif", class: "bg-green-500/20 text-green-400 border-green-500/30" },
  PERIODE_ESSAI: { label: "En essai", class: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  ALUMNI: { label: "Alumni", class: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
};

export default function RHPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [cells, setCells] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    userId: "", // for existing user
    firstName: "", // for new user
    lastName: "",
    email: "",
    cellId: "",
    position: "MEMBRE",
    status: "PERIODE_ESSAI",
  });
  const [isManualMode, setIsManualMode] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [m, u, c] = await Promise.all([getMembers(), getUsers(), getCells()]);
    setMembers(m);
    setUsers(u.filter((user: any) => !m.some((member: any) => member.userId === user.id)));
    setCells(c);
    
    // Default form values if lists are not empty
    if (u.length > 0 && form.userId === "") {
      const nonMembers = u.filter((user: any) => !m.some((member: any) => member.userId === user.id));
      if (nonMembers.length > 0) setForm(f => ({ ...f, userId: nonMembers[0].id }));
    }
    if (c.length > 0 && form.cellId === "") {
      setForm(f => ({ ...f, cellId: c[0].id }));
    }
    
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm("Voulez-vous vraiment retirer ce membre du club ? (Le compte utilisateur sera conservé mais son profil membre sera supprimé)")) return;
    startTransition(async () => {
      const res = await deleteMember(id);
      if (res.success) {
        setMembers(members.filter(m => m.id !== id));
        import('sonner').then(({ toast }) => toast.success('Membre retiré avec succès'));
      } else {
        import('sonner').then(({ toast }) => toast.error('Erreur', { description: res.error }));
      }
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (isManualMode) {
      if (!form.firstName || !form.lastName || !form.email || !form.cellId) {
        import('sonner').then(({ toast }) => toast.error('Erreur', { description: "Veuillez remplir tous les champs obligatoires" }));
        return;
      }
      startTransition(async () => {
        const res = await createNewMemberManually(form);
        if (res.success) {
          loadData();
          setShowCreate(false);
          import('sonner').then(({ toast }) => toast.success('Nouveau membre ajouté avec succès. Le mot de passe par défaut est Cisco@2024.'));
        } else {
          import('sonner').then(({ toast }) => toast.error('Erreur', { description: res.error }));
        }
      });
    } else {
      if (!form.userId || !form.cellId) {
        import('sonner').then(({ toast }) => toast.error('Erreur', { description: "Veuillez sélectionner un utilisateur et une cellule" }));
        return;
      }
      startTransition(async () => {
        const res = await createMember(form);
        if (res.success) {
          loadData();
          setShowCreate(false);
          import('sonner').then(({ toast }) => toast.success('Membre ajouté avec succès'));
        } else {
          import('sonner').then(({ toast }) => toast.error('Erreur', { description: res.error }));
        }
      });
    }
  };

  const actifsCount = members.filter(m => m.status === "ACTIF").length;
  const essaiCount = members.filter(m => m.status === "PERIODE_ESSAI").length;

  return (
    <AdminShell title="Ressources Humaines" subtitle="Organigramme, recrutement et documents RH">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8 max-w-7xl mx-auto pb-12">

        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Users, label: "Effectif Actif", value: `${actifsCount} Membres`, sub: "Actuellement dans le club", color: "cyan" },
            { icon: Clock, label: "Période d'essai", value: `${essaiCount} Candidats`, sub: "À évaluer ce semestre", color: "amber" },
            { icon: FolderArchive, label: "Documents RH", value: "3 Fichiers", sub: "Modèles & chartes", color: "purple" },
          ].map(({ icon: Icon, label, value, sub, color }) => (
            <Card key={label} className="bg-white/5 border-white/10 backdrop-blur-md group relative overflow-hidden hover:border-white/20 transition-all">
              <div className={`absolute inset-0 bg-gradient-to-br ${color === 'cyan' ? 'from-cyan-500/5' : color === 'amber' ? 'from-amber-500/5' : 'from-purple-500/5'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{label}</p>
                    <p className={`text-2xl font-extrabold ${color === 'cyan' ? 'text-cyan-400' : color === 'amber' ? 'text-amber-400' : 'text-purple-400'}`}>{value}</p>
                    <p className="text-xs text-gray-500 mt-1">{sub}</p>
                  </div>
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${color === 'cyan' ? 'bg-cyan-500/10 text-cyan-400' : color === 'amber' ? 'bg-amber-500/10 text-amber-400' : 'bg-purple-500/10 text-purple-400'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                {label === "Documents RH" && (
                  <div className="mt-4 space-y-2">
                    {["Modèle_Attestation.pdf", "Charte_Club_Signée.zip"].map(f => (
                      <div key={f} className="flex justify-between items-center text-xs text-gray-400 hover:text-white transition-colors">
                        <span>{f}</span>
                        <Download className="h-3.5 w-3.5 cursor-pointer" />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Members Table */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-white text-xl">Annuaire des Membres</CardTitle>
                <CardDescription className="text-gray-400">Liste complète, évaluations et historique</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="h-10 w-[220px] rounded-xl border border-white/10 bg-white/5 px-3 pl-9 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  />
                </div>
                <Button onClick={() => setShowCreate(true)} className="bg-cyan-500 text-black hover:bg-cyan-400 font-semibold rounded-xl h-10">
                  <UserPlus className="mr-2 h-4 w-4" /> Ajouter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-12">
                <div className="h-8 w-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-gray-400">Membre</TableHead>
                    <TableHead className="text-gray-400">Cellule</TableHead>
                    <TableHead className="text-gray-400">Rôle</TableHead>
                    <TableHead className="text-gray-400">Statut</TableHead>
                    <TableHead className="text-gray-400">Adhésion</TableHead>
                    <TableHead className="text-right text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id} className="border-white/10 hover:bg-white/5 transition-colors group">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-white/10">
                            <AvatarFallback className="bg-white/5 text-cyan-400 font-bold text-sm">
                              {member.user.firstName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-white">{member.user.firstName} {member.user.lastName}</p>
                            <p className="text-xs text-gray-500">{member.user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{member.cell?.name ?? "-"}</TableCell>
                      <TableCell>
                        <Badge className="bg-white/10 text-gray-300 border-white/10 text-xs font-mono">
                          {member.position}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`border text-xs font-semibold ${STATUS_CONFIG[member.status]?.class ?? "bg-gray-500/20 text-gray-400 border-gray-500/30"}`}>
                          {STATUS_CONFIG[member.status]?.label ?? member.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-400 text-sm">
                        {new Date(member.joinDate).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg text-xs">Profil</Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(member.id)}
                            className="text-red-400 hover:text-white hover:bg-red-500 rounded-lg h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {members.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                        Aucun membre trouvé
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Modal Ajouter */}
      <AnimatePresence>
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
              <button onClick={() => setShowCreate(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
              <h3 className="text-xl font-bold text-white mb-6">Ajouter un membre</h3>
              
              <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-xl">
                <button type="button" onClick={() => setIsManualMode(true)} className={`flex-1 text-sm font-medium h-9 rounded-lg transition-all ${isManualMode ? 'bg-cyan-500 text-black' : 'text-gray-400 hover:text-white'}`}>Création Manuelle</button>
                <button type="button" onClick={() => setIsManualMode(false)} className={`flex-1 text-sm font-medium h-9 rounded-lg transition-all ${!isManualMode ? 'bg-cyan-500 text-black' : 'text-gray-400 hover:text-white'}`}>Depuis un Compte</button>
              </div>

              {!isManualMode && users.length === 0 ? (
                <div className="text-center p-6 border border-dashed border-white/10 rounded-xl">
                  <p className="text-gray-400 mb-4">Tous les utilisateurs enregistrés font déjà partie du club.</p>
                  <Button onClick={() => window.location.href = '/admin/permissions'} variant="outline" className="border-white/20 text-white">
                    Créer un nouveau compte utilisateur d'abord
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleCreate} className="space-y-4">
                  {isManualMode ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="text-sm text-gray-400 font-medium block mb-1.5">Adresse Email *</label>
                        <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full h-10 rounded-xl border border-white/10 bg-black px-3 text-sm text-white focus:outline-none focus:border-cyan-500/50" placeholder="prenom.nom@esprit.tn" />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 font-medium block mb-1.5">Prénom *</label>
                        <input type="text" required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="w-full h-10 rounded-xl border border-white/10 bg-black px-3 text-sm text-white focus:outline-none focus:border-cyan-500/50" placeholder="Prénom" />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 font-medium block mb-1.5">Nom *</label>
                        <input type="text" required value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="w-full h-10 rounded-xl border border-white/10 bg-black px-3 text-sm text-white focus:outline-none focus:border-cyan-500/50" placeholder="Nom" />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="text-sm text-gray-400 font-medium block mb-1.5">Utilisateur *</label>
                      <select required value={form.userId} onChange={e => setForm({...form, userId: e.target.value})} className="w-full h-10 rounded-xl border border-white/10 bg-black px-3 text-sm text-white focus:outline-none focus:border-cyan-500/50">
                        {users.map(u => (
                          <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.email})</option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm text-gray-400 font-medium block mb-1.5">Cellule *</label>
                    <select required value={form.cellId} onChange={e => setForm({...form, cellId: e.target.value})} className="w-full h-10 rounded-xl border border-white/10 bg-black px-3 text-sm text-white focus:outline-none focus:border-cyan-500/50">
                      {cells.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 font-medium block mb-1.5">Rôle (Position) *</label>
                      <select required value={form.position} onChange={e => setForm({...form, position: e.target.value})} className="w-full h-10 rounded-xl border border-white/10 bg-black px-3 text-sm text-white focus:outline-none focus:border-cyan-500/50">
                        <option value="MEMBRE">Membre</option>
                        <option value="RESPONSABLE">Responsable</option>
                        <option value="CO_RESPONSABLE">Co-Responsable</option>
                        <option value="BUREAU">Membre du Bureau</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 font-medium block mb-1.5">Statut *</label>
                      <select required value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full h-10 rounded-xl border border-white/10 bg-black px-3 text-sm text-white focus:outline-none focus:border-cyan-500/50">
                        <option value="PERIODE_ESSAI">En période d'essai</option>
                        <option value="ACTIF">Actif</option>
                        <option value="ALUMNI">Alumni</option>
                      </select>
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                    <Button type="button" variant="outline" onClick={() => setShowCreate(false)} className="rounded-xl border-white/10 bg-transparent text-gray-400 hover:text-white">Annuler</Button>
                    <Button type="submit" disabled={isPending} className="rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 font-semibold">{isPending ? "Ajout en cours..." : "Ajouter"}</Button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminShell>
  );
}
