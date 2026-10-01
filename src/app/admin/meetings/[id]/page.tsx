"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, ArrowLeft, CheckSquare, FileText, List, Users } from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function MeetingDetailsPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("agenda");

  // Mock
  const meeting = {
    id: params.id,
    title: "Réunion Préparation Bootcamp",
    type: "Cellule Technique",
    date: new Date("2024-11-10T14:00:00"),
    duration: 60,
    location: "Google Meet",
    status: "A_VENIR"
  };

  const agendaItems = [
    { id: 1, title: "Validation du programme formateur", duration: 20, owner: "Ahmed" },
    { id: 2, title: "Choix des équipements réseau", duration: 15, owner: "Sami" },
    { id: 3, title: "Logistique des pauses café", duration: 10, owner: "Fatma" },
    { id: 4, title: "Questions diverses", duration: 15, owner: "Tous" },
  ];

  const actionItems = [
    { id: 1, task: "Réserver les routeurs CISCO 2911", assignee: "Sami", due: "2024-11-12", status: "TODO" },
    { id: 2, task: "Imprimer les supports de cours", assignee: "Fatma", due: "2024-11-14", status: "TODO" },
  ];

  const participants = [
    { name: "Ahmed Ben Ali", role: "Organisateur", response: "ACCEPTED" },
    { name: "Sami Trabelsi", role: "Membre technique", response: "ACCEPTED" },
    { name: "Fatma Oueslati", role: "Membre logistique", response: "PENDING" },
  ];

  return (
    <div className="p-8 space-y-8 bg-muted/20 min-h-screen">
      <Link href="/admin/meetings" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-2 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux réunions
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-primary border-primary">{meeting.type}</Badge>
            <Badge className="bg-amber-500">À venir</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{meeting.title}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Modifier</Button>
          <Button>Démarrer la réunion</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-none shadow-sm bg-card/50">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Date</p>
                <p className="text-sm">{meeting.date.toLocaleDateString("fr-FR", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Heure & Durée</p>
                <p className="text-sm">{meeting.date.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })} ({meeting.duration} minutes)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Lieu</p>
                <p className="text-sm">{meeting.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Tabs defaultValue="agenda" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="agenda"><List className="w-4 h-4 mr-2 hidden sm:block" /> Ordre du jour</TabsTrigger>
              <TabsTrigger value="participants"><Users className="w-4 h-4 mr-2 hidden sm:block" /> Participants</TabsTrigger>
              <TabsTrigger value="minutes"><FileText className="w-4 h-4 mr-2 hidden sm:block" /> Compte Rendu</TabsTrigger>
              <TabsTrigger value="actions"><CheckSquare className="w-4 h-4 mr-2 hidden sm:block" /> Actions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="agenda" className="mt-6 space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Ordre du jour (Agenda)</CardTitle>
                    <CardDescription>Points à aborder durant la réunion</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">+ Ajouter</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mt-4">
                    {agendaItems.map((item, index) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg bg-background hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="bg-muted text-muted-foreground font-medium rounded-full w-6 h-6 flex items-center justify-center text-xs">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{item.title}</p>
                            <p className="text-xs text-muted-foreground">Animé par: {item.owner}</p>
                          </div>
                        </div>
                        <Badge variant="secondary">{item.duration} min</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="participants" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Invités et Réponses</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Rôle / Fonction</TableHead>
                        <TableHead>Réponse</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {participants.map((p, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{p.name}</TableCell>
                          <TableCell>{p.role}</TableCell>
                          <TableCell>
                            {p.response === "ACCEPTED" ? (
                              <Badge className="bg-green-500">Accepté</Badge>
                            ) : p.response === "DECLINED" ? (
                              <Badge variant="destructive">Refusé</Badge>
                            ) : (
                              <Badge variant="outline" className="text-amber-500 border-amber-500">En attente</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="minutes" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Procès Verbal (PV)</CardTitle>
                  <CardDescription>Rédigez le compte rendu pendant ou après la réunion.</CardDescription>
                </CardHeader>
                <CardContent>
                  <textarea 
                    className="w-full min-h-[300px] p-4 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary focus:outline-none resize-y"
                    placeholder="Saisissez le compte rendu ici... (Supporte Markdown)"
                    defaultValue="La réunion n'a pas encore commencé. Le PV sera rédigé ici."
                  />
                  <div className="flex justify-end mt-4">
                    <Button>Sauvegarder le PV</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="actions" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Plan d'Action (Action Items)</CardTitle>
                    <CardDescription>Tâches décidées lors de la réunion</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">+ Tâche</Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tâche</TableHead>
                        <TableHead>Responsable</TableHead>
                        <TableHead>Échéance</TableHead>
                        <TableHead>Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {actionItems.map((action, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{action.task}</TableCell>
                          <TableCell>{action.assignee}</TableCell>
                          <TableCell>{new Date(action.due).toLocaleDateString("fr-FR")}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{action.status}</Badge>
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
      </div>
    </div>
  );
}
