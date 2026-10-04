"use client";

import { useEffect, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { AdminShell } from "@/components/admin-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Shield, ShieldAlert, CheckCircle2, AlertCircle, Search, Trash2, UserPlus, X } from "lucide-react";
import { getUsers, updateUserRole, createUser, deleteUser } from "@/actions/users";

const ROLES = [
  "MEMBRE",
  "PRESIDENT",
  "VICE_PRESIDENT",
  "SECRETAIRE_GENERAL",
  "RH",
  "TRESORIER_SPONSORING",
  "RESPONSABLE_CELLULE",
  "ADMIN"
];

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-red-500/20 text-red-400 border-red-500/30",
  PRESIDENT: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  VICE_PRESIDENT: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  SECRETAIRE_GENERAL: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  RH: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  TRESORIER_SPONSORING: "bg-green-500/20 text-green-400 border-green-500/30",
  RESPONSABLE_CELLULE: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  MEMBRE: "bg-white/10 text-gray-300 border-white/20",
};

export default function PermissionsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ firstName: "", lastName: "", email: "", role: "MEMBRE" });

  const load = async () => {
    setLoading(true);
    const data = await getUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleRoleChange = (userId: string, newRole: string) => {
    startTransition(async () => {
      const res = await updateUserRole(userId, newRole);
      if (res.success) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        import('sonner').then(({ toast }) => toast.success('Rôle mis à jour avec succès', { description: `Nouveau rôle attribué.` }));
      } else {
        alert(res.error);
        import('sonner').then(({ toast }) => toast.error('Erreur', { description: res.error }));
      }
    });
  };

  const handleDeleteUser = (userId: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
    startTransition(async () => {
      const res = await deleteUser(userId);
      if (res.success) {
        setUsers(users.filter(u => u.id !== userId));
        import('sonner').then(({ toast }) => toast.success('Utilisateur supprimé avec succès'));
      } else {
        alert(res.error);
        import('sonner').then(({ toast }) => toast.error('Erreur', { description: res.error }));
      }
    });
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await createUser(addForm);
      if (res.success) {
        setUsers([res.user, ...users]);
        setShowAddModal(false);
        setAddForm({ firstName: "", lastName: "", email: "", role: "MEMBRE" });
        import('sonner').then(({ toast }) => toast.success('Utilisateur créé avec succès'));
      } else {
        alert(res.error);
        import('sonner').then(({ toast }) => toast.error('Erreur', { description: res.error }));
      }
    });
  };

  const filteredUsers = users.filter(u => 
    (u.firstName + " " + u.lastName).toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminShell title="Gestion des Autorisations" subtitle="Gérez les rôles et les accès au dashboard">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-7xl mx-auto pb-12">
        
        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Shield, label: "Total Utilisateurs", value: String(users.length), sub: "Inscrits sur la plateforme", color: "cyan" },
            { icon: ShieldAlert, label: "Membres du Bureau", value: String(users.filter(u => u.role !== "MEMBRE" && u.role !== "ADMIN").length), sub: "Avec accès Board", color: "amber" },
            { icon: CheckCircle2, label: "Admins", value: String(users.filter(u => u.role === "ADMIN").length), sub: "Accès total", color: "red" },
          ].map(({ icon: Icon, label, value, sub, color }) => (
            <Card key={label} className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{label}</p>
                    <p className={`text-3xl font-extrabold ${color === "cyan" ? "text-cyan-400" : color === "amber" ? "text-amber-400" : "text-red-400"}`}>{value}</p>
                    <p className="text-xs text-gray-500 mt-1">{sub}</p>
                  </div>
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${color === "cyan" ? "bg-cyan-500/10 text-cyan-400" : color === "amber" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Users Table */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-white text-xl">Contrôle d&apos;accès</CardTitle>
                <CardDescription className="text-gray-400">Modifiez instantanément les privilèges des utilisateurs</CardDescription>
              </div>
              <div className="flex gap-3 relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom ou email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-10 w-[240px] rounded-xl border border-white/10 bg-white/5 px-3 pl-9 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  />
                </div>
                <Button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-cyan-500 text-black hover:bg-cyan-400 font-semibold rounded-xl h-10"
                >
                  <UserPlus className="h-4 w-4 mr-2" /> Ajouter
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
              <div className="rounded-xl border border-white/10 overflow-hidden">
                <Table>
                  <TableHeader className="bg-black/40">
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-gray-400">Utilisateur</TableHead>
                      <TableHead className="text-gray-400">Email</TableHead>
                      <TableHead className="text-gray-400">Rôle Actuel</TableHead>
                      <TableHead className="text-right text-gray-400">Modifier le Rôle</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="border-white/10 hover:bg-white/5 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border border-white/10">
                              <AvatarFallback className="bg-white/5 text-cyan-400 font-bold text-sm">
                                {(user.firstName?.[0] || "") + (user.lastName?.[0] || "")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-semibold text-white capitalize">{user.firstName} {user.lastName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-400">{user.email}</TableCell>
                        <TableCell>
                          <Badge className={`border text-[10px] font-bold tracking-wider ${ROLE_COLORS[user.role] ?? ROLE_COLORS.MEMBRE}`}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <select
                              value={user.role}
                              disabled={isPending || user.email === "feresfatmi07@gmail.com"}
                              onChange={(e) => handleRoleChange(user.id, e.target.value)}
                              className="h-8 w-40 rounded-lg border border-white/10 bg-black px-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {ROLES.map(role => (
                                <option key={role} value={role}>{role}</option>
                              ))}
                            </select>
                            <Button 
                              variant="destructive" 
                              size="icon" 
                              className="h-8 w-8 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-lg"
                              disabled={isPending || user.email === "feresfatmi07@gmail.com"}
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredUsers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                          Aucun utilisateur trouvé.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-6">Ajouter un utilisateur</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 font-medium">Prénom *</label>
                  <input required type="text" value={addForm.firstName} onChange={e => setAddForm({...addForm, firstName: e.target.value})} className="w-full h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 font-medium">Nom *</label>
                  <input required type="text" value={addForm.lastName} onChange={e => setAddForm({...addForm, lastName: e.target.value})} className="w-full h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400 font-medium">Email *</label>
                <input required type="email" value={addForm.email} onChange={e => setAddForm({...addForm, email: e.target.value})} className="w-full h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400 font-medium">Rôle *</label>
                <select value={addForm.role} onChange={e => setAddForm({...addForm, role: e.target.value})} className="w-full h-10 rounded-xl border border-white/10 bg-black px-3 text-sm text-white focus:outline-none focus:border-cyan-500/50">
                  {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="rounded-xl border-white/10 bg-transparent text-gray-400 hover:text-white">Annuler</Button>
                <Button type="submit" disabled={isPending} className="rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 font-semibold">{isPending ? "Ajout..." : "Ajouter"}</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AdminShell>
  );
}
