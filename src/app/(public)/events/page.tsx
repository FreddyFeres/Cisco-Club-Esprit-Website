import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Users } from "lucide-react";
import Link from "next/link";

// Mock des événements (sera remplacé par un fetch via prisma dans une vraie app)
const MOCK_EVENTS = [
  {
    id: "1",
    title: "Bootcamp CCNA Intensif",
    category: "Formation",
    startDate: new Date("2024-11-15T09:00:00"),
    location: "Salle 04 - Bâtiment C",
    capacity: 30,
    enrolled: 28,
    status: "PUBLIE",
  },
  {
    id: "2",
    title: "Hackathon CyberSec",
    category: "Compétition",
    startDate: new Date("2024-12-01T18:00:00"),
    location: "Hub Innovation",
    capacity: 100,
    enrolled: 100,
    status: "COMPLET",
  },
  {
    id: "3",
    title: "Conférence: L'avenir du Cloud",
    category: "Conférence",
    startDate: new Date("2024-11-20T14:00:00"),
    location: "Amphithéâtre",
    capacity: 200,
    enrolled: 150,
    status: "PUBLIE",
  }
];

export default function EventsPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Nos Événements</h1>
          <p className="text-muted-foreground mt-2">
            Découvrez et participez aux ateliers, formations et conférences du Cisco Club.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Calendrier</Button>
          <Button>Filtrer</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_EVENTS.map(event => (
          <Card key={event.id} className="flex flex-col h-full hover:border-primary transition-colors">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="text-primary border-primary">
                  {event.category}
                </Badge>
                {event.status === "COMPLET" ? (
                  <Badge variant="destructive">Complet</Badge>
                ) : (
                  <Badge className="bg-green-500 hover:bg-green-600">Places dispo</Badge>
                )}
              </div>
              <CardTitle className="line-clamp-2">{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span>{event.startDate.toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{event.enrolled} / {event.capacity} inscrits</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full" variant={event.status === "COMPLET" ? "secondary" : "default"}>
                <Link href={`/events/${event.id}`}>
                  {event.status === "COMPLET" ? "Rejoindre liste d'attente" : "S'inscrire"}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
