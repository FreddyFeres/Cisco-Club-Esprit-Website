"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, Search, UserPlus, Users, Clock, FolderArchive } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";

const MOCK_MEMBERS = [
  { id: "1", name: "Youssef Gharbi", cell: "Bureau Exécutif", role: "ADMIN", status: "ACTIF", joined: "2023-09-01" },
  { id: "2", name: "Fatma Oueslati", cell: "Technique", role: "MEMBRE", status: "ACTIF", joined: "2024-02-15" },
  { id: "3", name: "Ahmed Ben Ali", cell: "Sponsoring", role: "TRESORIER", status: "ACTIF", joined: "2023-11-20" },
  { id: "4", name: "Sami Trabelsi", cell: "Communication", role: "MEMBRE", status: "PERIODE_ESSAI", joined: "2024-10-01" },
  { id: "5", name: "Ines Mahmoud", cell: "Événementiel", role: "RESPONSABLE", status: "ALUMNI", joined: "2022-09-15" },
];

const STATUS_CONFIG: Record<string, { label: string; class: string }> = {
  ACTIF: { label: "Actif", class: "bg-green-500/20 text-green-400 border-green-500/30" },
  PERIODE_ESSAI: { label: "En essai", class: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  ALUMNI: { label: "Alumni", class: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
};

export default function RHPage() {
  return (
    <AdminShell title="Ressources Humaines" subtitle="Organigramme, recrutement et documents RH">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8 max-w-7xl mx-auto pb-12">

        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Users, label: "Effectif Actif", value: "45 Membres", sub: "+5 depuis le mois dernier", color: "cyan" },
            { icon: Clock, label: "Période d'essai", value: "12 Candidats", sub: "À évaluer ce semestre", color: "amber" },
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
                <Button className="bg-cyan-500 text-black hover:bg-cyan-400 font-semibold rounded-xl h-10">
                  <UserPlus className="mr-2 h-4 w-4" /> Ajouter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
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
                {MOCK_MEMBERS.map((member) => (
                  <TableRow key={member.id} className="border-white/10 hover:bg-white/5 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-white/10">
                          <AvatarFallback className="bg-white/5 text-cyan-400 font-bold text-sm">
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-white">{member.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{member.cell}</TableCell>
                    <TableCell>
                      <Badge className="bg-white/10 text-gray-300 border-white/10 text-xs font-mono">
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`border text-xs font-semibold ${STATUS_CONFIG[member.status]?.class ?? ""}`}>
                        {STATUS_CONFIG[member.status]?.label ?? member.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-400 text-sm">
                      {new Date(member.joined).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/5 rounded-lg text-xs">Évaluer</Button>
                      <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg text-xs">Profil</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </AdminShell>
  );
}
