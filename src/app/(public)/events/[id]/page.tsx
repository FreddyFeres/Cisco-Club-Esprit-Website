import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Users, Clock, ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  // Mock détaillé (fetch server-side en réel)
  const event = {
    id: params.id,
    title: "Bootcamp CCNA Intensif - Module 1",
    description: "Rejoignez-nous pour une session intensive couvrant les bases des réseaux, le modèle OSI, le routage et la commutation. Pratique sur de vrais équipements Cisco.",
    category: "Formation",
    startDate: new Date("2024-11-15T09:00:00"),
    endDate: new Date("2024-11-15T17:00:00"),
    location: "Salle 04 - Bâtiment C (ESPRIT)",
    capacity: 30,
    enrolled: 28,
    status: "PUBLIE",
    instructor: "Ahmed Ben Ali (CCIE)",
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Link href="/events" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux événements
      </Link>

      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="outline" className="text-primary border-primary">
              {event.category}
            </Badge>
            <Badge className="bg-green-500">Places dispo</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{event.title}</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-muted/30 border-none">
            <CardContent className="flex items-start gap-4 p-6">
              <div className="p-3 bg-background rounded-xl shrink-0">
                <CalendarDays className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Date et Heure</h3>
                <p className="text-sm text-muted-foreground">
                  {event.startDate.toLocaleDateString("fr-FR", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <p className="text-sm text-muted-foreground">
                  De {event.startDate.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })} à {event.endDate.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30 border-none">
            <CardContent className="flex items-start gap-4 p-6">
              <div className="p-3 bg-background rounded-xl shrink-0">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Lieu</h3>
                <p className="text-sm text-muted-foreground">{event.location}</p>
                <a href="#" className="text-sm text-primary hover:underline mt-1 inline-block">Voir sur la carte</a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions & Stats */}
        <div className="flex flex-col md:flex-row items-center justify-between p-6 border rounded-2xl bg-card shadow-sm gap-6">
          <div className="flex gap-6 items-center">
            <div className="text-center">
              <div className="text-2xl font-bold">{event.capacity - event.enrolled}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Places restantes</div>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="participant" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground text-xs font-bold border-2 border-background flex items-center justify-center z-10">
                +{event.enrolled - 3}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <Button variant="outline" size="lg" className="w-full md:w-auto">
              <Share2 className="mr-2 h-4 w-4" /> Partager
            </Button>
            <Button size="lg" className="w-full md:w-auto text-md">
              S'inscrire maintenant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
