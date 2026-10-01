"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Plus, Users, Video } from "lucide-react";
import Link from "next/link";

const MOCK_MEETINGS = [
  {
    id: "1",
    title: "Réunion Préparation Bootcamp",
    type: "Cellule Technique",
    date: new Date("2024-11-10T14:00:00"),
    duration: 60,
    location: "Google Meet",
    participants: 5,
    status: "A_VENIR"
  },
  {
    id: "2",
    title: "Point Hebdo Bureau",
    type: "Bureau Exécutif",
    date: new Date("2024-11-05T18:00:00"),
    duration: 90,
    location: "Salle Réunion - Incubateur",
    participants: 7,
    status: "TERMINE"
  },
  {
    id: "3",
    title: "Brainstorming Sponsors",
    type: "Cellule Sponsoring",
    date: new Date("2024-10-28T10:00:00"),
    duration: 45,
    location: "Microsoft Teams",
    participants: 3,
    status: "TERMINE"
  }
];

export default function MeetingsPage() {
  return (
    <div className="p-8 space-y-8 bg-muted/20 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Réunions Internes</h1>
          <p className="text-muted-foreground mt-1">Gérez l'ordre du jour, les comptes-rendus et les plans d'actions.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nouvelle Réunion
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_MEETINGS.map(meeting => (
          <Card key={meeting.id} className="flex flex-col h-full hover:border-primary transition-colors cursor-pointer" asChild>
            <Link href={`/admin/meetings/${meeting.id}`}>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="text-primary border-primary">
                    {meeting.type}
                  </Badge>
                  {meeting.status === "A_VENIR" ? (
                    <Badge className="bg-amber-500">À venir</Badge>
                  ) : (
                    <Badge variant="secondary">Terminée</Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{meeting.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{meeting.date.toLocaleDateString("fr-FR", { weekday: 'short', day: 'numeric', month: 'long' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{meeting.date.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })} ({meeting.duration} min)</span>
                </div>
                <div className="flex items-center gap-2">
                  {meeting.location.includes("Meet") || meeting.location.includes("Teams") ? (
                    <Video className="h-4 w-4" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                  <span>{meeting.location}</span>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                  <Users className="h-4 w-4" />
                  <span>{meeting.participants} participants invités</span>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
