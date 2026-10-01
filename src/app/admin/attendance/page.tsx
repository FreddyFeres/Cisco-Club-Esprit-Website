"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, CheckCircle2, XCircle, AlertCircle, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MOCK_ATTENDANCE = [
  { id: "1", name: "Ahmed Ben Ali", role: "MEMBRE", status: "PRESENT", method: "QR" },
  { id: "2", name: "Fatma Oueslati", role: "MEMBRE", status: "ABSENT", method: "-" },
  { id: "3", name: "Sami Trabelsi", role: "RESPONSABLE", status: "EXCUSE", method: "Justificatif validé" },
  { id: "4", name: "Youssef Gharbi", role: "MEMBRE", status: "RETARD", method: "Manuel" },
];

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState("scan");

  return (
    <div className="p-8 space-y-8 bg-muted/20 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pointage & Assiduité</h1>
          <p className="text-muted-foreground mt-1">Gérez les présences pour: Bootcamp CCNA (15 Nov 2024)</p>
        </div>
        <Button variant="outline">Changer d'événement</Button>
      </div>

      <Tabs defaultValue="scan" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="scan">Mode Scan QR</TabsTrigger>
          <TabsTrigger value="list">Feuille d'appel</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scan" className="mt-6">
          <Card className="max-w-2xl mx-auto border-2 border-dashed">
            <CardHeader className="text-center pb-2">
              <CardTitle>Scanner un participant</CardTitle>
              <CardDescription>Demandez aux étudiants de présenter leur QR Code généré dans l'application</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-10">
              <div className="h-64 w-64 bg-muted rounded-xl flex items-center justify-center relative overflow-hidden mb-6">
                <QrCode className="h-20 w-20 text-muted-foreground/50" />
                <div className="absolute inset-0 border-4 border-primary/50 animate-pulse rounded-xl"></div>
              </div>
              <p className="text-sm font-medium text-muted-foreground animate-pulse">En attente de scan...</p>
              
              {/* Simulation de scan réussi */}
              <div className="mt-8 flex gap-4">
                <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Simuler Succès
                </Button>
                <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                  <XCircle className="mr-2 h-4 w-4" /> Simuler Erreur
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Registre des présences</CardTitle>
                  <CardDescription>Saisie manuelle et suivi en temps réel (28 inscrits)</CardDescription>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="Chercher un membre..." 
                      className="h-9 w-[250px] rounded-md border border-input bg-transparent px-3 py-1 pl-9 text-sm shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Participant</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Méthode</TableHead>
                    <TableHead className="text-right">Actions Manuelles</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_ATTENDANCE.map((att) => (
                    <TableRow key={att.id}>
                      <TableCell className="font-medium">{att.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{att.role}</Badge>
                      </TableCell>
                      <TableCell>
                        {att.status === "PRESENT" && <Badge className="bg-green-500">Présent</Badge>}
                        {att.status === "ABSENT" && <Badge variant="destructive">Absent</Badge>}
                        {att.status === "RETARD" && <Badge className="bg-amber-500">En retard</Badge>}
                        {att.status === "EXCUSE" && <Badge variant="secondary">Excusé</Badge>}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{att.method}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" className="h-8 text-green-600">P</Button>
                          <Button size="sm" variant="outline" className="h-8 text-red-600">A</Button>
                          <Button size="sm" variant="outline" className="h-8 text-amber-600">R</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
