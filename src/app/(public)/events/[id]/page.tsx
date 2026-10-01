import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Users, Clock, ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Mock détaillé (fetch server-side en réel)
  const event = {
    id: id,
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
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-black to-black -z-10" />
      
      <div className="container mx-auto py-12 px-6 max-w-4xl relative z-10">
        <Link href="/events" className="inline-flex items-center text-sm text-gray-400 hover:text-cyan-400 mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux événements
        </Link>

        <div className="space-y-10">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Badge variant="outline" className="text-cyan-400 border-cyan-400/50 bg-cyan-400/10">
                {event.category}
              </Badge>
              <Badge className="bg-cyan-500 text-black">Places dispo</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-400">
              {event.title}
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed border-l-4 border-cyan-500/50 pl-6">
              {event.description}
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl shrink-0">
                  <CalendarDays className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Date et Heure</h3>
                  <p className="text-sm text-gray-400">
                    {event.startDate.toLocaleDateString("fr-FR", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-sm text-gray-400">
                    De {event.startDate.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })} à {event.endDate.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl shrink-0">
                  <MapPin className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Lieu</h3>
                  <p className="text-sm text-gray-400">{event.location}</p>
                  <a href="#" className="text-sm text-cyan-400 hover:text-cyan-300 mt-1 inline-block transition-colors">Voir sur la carte</a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions & Stats */}
          <div className="flex flex-col md:flex-row items-center justify-between p-8 border border-white/10 rounded-2xl bg-black/40 backdrop-blur-xl shadow-2xl gap-8">
            <div className="flex gap-8 items-center w-full md:w-auto justify-center md:justify-start">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{event.capacity - event.enrolled}</div>
                <div className="text-xs text-cyan-400 uppercase tracking-wider font-semibold mt-1">Places restantes</div>
              </div>
              <div className="w-px h-16 bg-white/10"></div>
              <div className="flex -space-x-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full bg-black border-2 border-cyan-500/30 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="participant" className="opacity-80" />
                  </div>
                ))}
                <div className="w-12 h-12 rounded-full bg-cyan-500 text-black text-sm font-bold border-2 border-black flex items-center justify-center z-10 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                  +{event.enrolled - 3}
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto flex-col sm:flex-row">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10">
                <Share2 className="mr-2 h-4 w-4" /> Partager
              </Button>
              <Button size="lg" className="w-full sm:w-auto text-md bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">
                S'inscrire maintenant
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
