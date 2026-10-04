// Server Component
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, ArrowLeft, Users, Target } from "lucide-react";
import Link from "next/link";
import { MeetingTabs } from "./meeting-tabs";
import { getMeetingById } from "@/actions/meetings";
import { AdminShell } from "@/components/admin-shell";
import { notFound } from "next/navigation";

export default async function MeetingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meeting = await getMeetingById(id);

  if (!meeting) notFound();

  const agendaItems = meeting.agendaItems.map((item: any) => ({
    id: item.id,
    title: item.title,
    duration: item.durationEst,
    owner: "—",
  }));

  const actionItems = meeting.actionItems.map((a: any) => ({
    id: a.id,
    task: a.task,
    assignee: a.assigneeId ?? "—",
    due: a.dueDate,
    status: a.status ?? "TODO",
  }));

  const participants = meeting.participants.map((p: any) => ({
    name: p.user ? `${p.user.firstName} ${p.user.lastName}` : "—",
    role: p.user?.role ?? "Membre",
    response: p.status ?? "PENDING",
  }));

  const existingPv = (meeting.minutes as any)?.content ?? "";
  const isUpcoming = new Date(meeting.startDate) > new Date();

  const TYPE_COLORS: Record<string, string> = {
    "Bureau Exécutif":  "text-cyan-400 bg-cyan-500/20 border-cyan-500/30",
    "Cellule Technique": "text-purple-400 bg-purple-500/20 border-purple-500/30",
    "Cellule Sponsoring": "text-amber-400 bg-amber-500/20 border-amber-500/30",
    "Générale": "text-green-400 bg-green-500/20 border-green-500/30",
  };

  return (
    <AdminShell
      title={meeting.title}
      subtitle={meeting.objective ?? "Détails et compte rendu de la réunion"}
    >
      <div className="max-w-7xl mx-auto space-y-8 pb-12">

        {/* Back link */}
        <Link
          href="/admin/meetings"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Retour aux réunions
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge className={`border text-xs font-semibold ${TYPE_COLORS[meeting.type] ?? "text-gray-400 bg-gray-500/20 border-gray-500/30"}`}>
                {meeting.type}
              </Badge>
              {isUpcoming ? (
                <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs">À venir</Badge>
              ) : (
                <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs">Terminée</Badge>
              )}
            </div>
            <h1 className="text-3xl font-black text-white">{meeting.title}</h1>
            {meeting.objective && (
              <p className="text-gray-400 mt-2 max-w-xl text-sm">{meeting.objective}</p>
            )}
          </div>
          <div className="flex gap-3 shrink-0">
            <Button variant="outline" className="rounded-xl border-white/20 bg-white/5 text-gray-300 hover:text-white">
              Modifier
            </Button>
            <Button className="rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              Démarrer la réunion
            </Button>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Info sidebar */}
          <div className="space-y-4">
            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <Calendar className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Date</p>
                    <p className="text-white font-semibold text-sm">
                      {new Date(meeting.startDate).toLocaleDateString("fr-FR", {
                        weekday: "long", day: "numeric", month: "long", year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Heure &amp; Durée</p>
                    <p className="text-white font-semibold text-sm">
                      {new Date(meeting.startDate).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      {" "}<span className="text-gray-400 font-normal">({meeting.duration} min)</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Lieu</p>
                    <p className="text-white font-semibold text-sm">{meeting.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <Users className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Participants</p>
                    <p className="text-white font-semibold text-sm">{participants.length} invités</p>
                  </div>
                </div>

                {meeting.objective && (
                  <div className="flex items-start gap-4 pt-4 border-t border-white/10">
                    <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Target className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Objectif</p>
                      <p className="text-gray-300 text-sm leading-relaxed">{meeting.objective}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Points agenda", value: agendaItems.length, color: "cyan" },
                { label: "Actions",       value: actionItems.length, color: "amber" },
              ].map(({ label, value, color }) => (
                <Card key={label} className="bg-white/5 border-white/10">
                  <CardContent className="pt-4 pb-4 text-center">
                    <p className={`text-2xl font-black ${color === "cyan" ? "text-cyan-400" : "text-amber-400"}`}>{value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="lg:col-span-2">
            <MeetingTabs
              meetingId={id}
              agendaItems={agendaItems}
              actionItems={actionItems}
              participants={participants}
              initialPv={existingPv}
            />
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
