"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Download, FileText, Search, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const MOCK_MEMBERS = [
  { id: "1", name: "Youssef Gharbi", cell: "Bureau Exécutif", role: "ADMIN", status: "ACTIF", joined: "2023-09-01" },
  { id: "2", name: "Fatma Oueslati", cell: "Technique", role: "MEMBRE", status: "ACTIF", joined: "2024-02-15" },
  { id: "3", name: "Ahmed Ben Ali", cell: "Sponsoring", role: "TRESORIER", status: "ACTIF", joined: "2023-11-20" },
  { id: "4", name: "Sami Trabelsi", cell: "Communication", role: "MEMBRE", status: "PERIODE_ESSAI", joined: "2024-10-01" },
  { id: "5", name: "Ines Mahmoud", cell: "Event", role: "RESPONSABLE", status: "ALUMNI", joined: "2022-09-15" },
];

export default function RHPage() {
  return (
    <div className="p-8 space-y-8 bg-muted/20 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ressources Humaines</h1>
          <p className="text-muted-foreground mt-1">Gérez l'organigramme, le recrutement et le coffre-fort documentaire.</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" /> Ajouter Membre
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Effectif Actif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">45 Membres</div>
            <p className="text-xs text-muted-foreground">+5 depuis le mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Période d'essai</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">12 Candidats</div>
            <p className="text-xs text-muted-foreground">À évaluer ce semestre</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Coffre-fort RH</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
             <div className="flex justify-between items-center text-sm">
                <span>Modèle_Attestation.pdf</span>
                <Download className="h-4 w-4 text-primary cursor-pointer" />
             </div>
             <div className="flex justify-between items-center text-sm">
                <span>Charte_Club_Signée.zip</span>
                <Download className="h-4 w-4 text-primary cursor-pointer" />
             </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Annuaire des membres</CardTitle>
              <CardDescription>Liste complète, évaluations et historique.</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="h-9 w-[250px] rounded-md border border-input bg-transparent px-3 py-1 pl-9 text-sm shadow-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Membre</TableHead>
                <TableHead>Cellule</TableHead>
                <TableHead>Rôle Système</TableHead>
                <TableHead>Statut RH</TableHead>
                <TableHead>Adhésion</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_MEMBERS.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="flex items-center gap-3 font-medium">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {member.name}
                  </TableCell>
                  <TableCell>{member.cell}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{member.role}</Badge>
                  </TableCell>
                  <TableCell>
                    {member.status === "ACTIF" && <Badge className="bg-green-500">Actif</Badge>}
                    {member.status === "PERIODE_ESSAI" && <Badge className="bg-amber-500">En essai</Badge>}
                    {member.status === "ALUMNI" && <Badge variant="secondary">Alumni</Badge>}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(member.joined).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Évaluer</Button>
                    <Button variant="ghost" size="sm" className="text-primary">Profil</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
