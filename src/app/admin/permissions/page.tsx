"use client";

import { useEffect, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { AdminShell } from "@/components/admin-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Shield, ShieldAlert, CheckCircle2, AlertCircle, Search } from "lucide-react";
import { getUsers, updateUserRole } from "@/actions/users";

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
      } else {
        alert(res.error);
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Rechercher par nom ou email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-10 w-[280px] rounded-xl border border-white/10 bg-white/5 px-3 pl-9 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
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
                          <select
                            value={user.role}
                            disabled={isPending || user.email === "feresfatmi07@gmail.com"}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="h-8 w-48 rounded-lg border border-white/10 bg-black px-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {ROLES.map(role => (
                              <option key={role} value={role}>{role}</option>
                            ))}
                          </select>
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
    </AdminShell>
  );
}
