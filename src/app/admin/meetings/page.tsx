"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Plus, Users, Video } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";

const MOCK_MEETINGS = [
  {
    id: "1",
    title: "Réunion Préparation Bootcamp",
    type: "Cellule Technique",
    date: new Date("2024-11-10T14:00:00"),
    duration: 60,
    location: "Google Meet",
    participants: 5,
    status: "A_VENIR",
  },
  {
    id: "2",
    title: "Point Hebdo Bureau",
    type: "Bureau Exécutif",
    date: new Date("2024-11-05T18:00:00"),
    duration: 90,
    location: "Salle Réunion - Incubateur",
    participants: 7,
    status: "TERMINE",
  },
  {
    id: "3",
    title: "Brainstorming Sponsors",
    type: "Cellule Sponsoring",
    date: new Date("2024-10-28T10:00:00"),
    duration: 45,
    location: "Microsoft Teams",
    participants: 3,
    status: "TERMINE",
  },
];

const TYPE_COLORS: Record<string, string> = {
  "Bureau Exécutif": "text-cyan-400 bg-cyan-500/20 border-cyan-500/30",
  "Cellule Technique": "text-purple-400 bg-purple-500/20 border-purple-500/30",
  "Cellule Sponsoring": "text-amber-400 bg-amber-500/20 border-amber-500/30",
};

export default function MeetingsPage() {
  return (
    <AdminShell title="Réunions Internes" subtitle="Ordre du jour, comptes-rendus et plans d'action">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8 max-w-7xl mx-auto pb-12">

        {/* Header Action */}
        <div className="flex justify-end">
          <Button className="bg-cyan-500 text-black hover:bg-cyan-400 font-semibold rounded-xl">
            <Plus className="mr-2 h-4 w-4" /> Nouvelle Réunion
          </Button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_MEETINGS.map((meeting, i) => (
            <motion.div
              key={meeting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link href={`/admin/meetings/${meeting.id}`} className="block h-full group">
                <Card className="h-full flex flex-col bg-white/5 border-white/10 backdrop-blur-md hover:border-cyan-500/40 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-3">
                      <Badge className={`border text-xs font-semibold ${TYPE_COLORS[meeting.type] ?? "text-gray-400 bg-gray-500/20"}`}>
                        {meeting.type}
                      </Badge>
                      {meeting.status === "A_VENIR" ? (
                        <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs">À venir</Badge>
                      ) : (
                        <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs">Terminée</Badge>
                      )}
                    </div>
                    <CardTitle className="text-white text-lg group-hover:text-cyan-400 transition-colors">
                      {meeting.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-3 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{meeting.date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{meeting.date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })} <span className="text-gray-500">({meeting.duration} min)</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      {meeting.location.includes("Meet") || meeting.location.includes("Teams") ? (
                        <Video className="h-4 w-4 text-gray-500" />
                      ) : (
                        <MapPin className="h-4 w-4 text-gray-500" />
                      )}
                      <span>{meeting.location}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-3 mt-3 border-t border-white/10">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span><span className="font-bold text-white">{meeting.participants}</span> participants invités</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AdminShell>
  );
}
