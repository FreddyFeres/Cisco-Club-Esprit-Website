"use client";

import { useState, useTransition, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckSquare, FileText, List, Users,
  Save, CheckCircle2, AlertCircle, Clock, Download, RotateCcw,
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { updateMeetingMinutes } from "@/actions/meetings";

type AgendaItem  = { id: string | number; title: string; duration: number; owner: string };
type ActionItem  = { id: string | number; task: string; assignee: string; due: string | Date; status: string };
type Participant = { name: string; role: string; response: string };

// ── PV Module ─────────────────────────────────────────────────────────────────
function PvEditor({ meetingId, initialPv }: { meetingId: string; initialPv: string }) {
  const [content, setContent]     = useState(initialPv);
  const [savedContent, setSaved]  = useState(initialPv);
  const [status, setStatus]       = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg]   = useState("");
  const [isPending, startTransition] = useTransition();
  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDirty = content !== savedContent;

  const save = useCallback(async (text: string) => {
    setStatus("saving");
    const res = await updateMeetingMinutes(meetingId, text);
    if (res.error) {
      setStatus("error");
      setErrorMsg(res.error);
    } else {
      setStatus("saved");
      setSaved(text);
      setTimeout(() => setStatus("idle"), 3000);
    }
  }, [meetingId]);

  const handleChange = (val: string) => {
    setContent(val);
    setStatus("idle");
    // Auto-save after 2s of inactivity
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(() => {
      startTransition(() => save(val));
    }, 2000);
  };

  const handleManualSave = () => {
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    startTransition(() => save(content));
  };

  const handleReset = () => {
    if (!confirm("Réinitialiser le PV à la dernière version sauvegardée ?")) return;
    setContent(savedContent);
    setStatus("idle");
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `PV_reunion_${meetingId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-md">
      <CardHeader className="border-b border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-cyan-400" />
              Procès Verbal (PV)
            </CardTitle>
            <CardDescription className="text-gray-400 mt-1">
              Rédigez le compte rendu — sauvegarde automatique activée
            </CardDescription>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-2 shrink-0">
            {status === "saving" && (
              <span className="flex items-center gap-1.5 text-xs text-amber-400">
                <div className="h-3 w-3 border border-amber-400 border-t-transparent rounded-full animate-spin" />
                Sauvegarde...
              </span>
            )}
            {status === "saved" && (
              <span className="flex items-center gap-1.5 text-xs text-green-400">
                <CheckCircle2 className="h-3.5 w-3.5" /> Sauvegardé
              </span>
            )}
            {status === "error" && (
              <span className="flex items-center gap-1.5 text-xs text-red-400">
                <AlertCircle className="h-3.5 w-3.5" /> {errorMsg}
              </span>
            )}
            {isDirty && status === "idle" && (
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <Clock className="h-3.5 w-3.5" /> Non sauvegardé
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-5 space-y-4">
        {/* Toolbar */}
        <div className="flex items-center gap-2 p-3 bg-white/[0.03] rounded-xl border border-white/5">
          <button
            onClick={() => setContent(c => c + "\n## Point ")}
            className="px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all font-medium"
          >
            + Point
          </button>
          <button
            onClick={() => setContent(c => c + "\n**Décision :** ")}
            className="px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all font-medium"
          >
            + Décision
          </button>
          <button
            onClick={() => setContent(c => c + "\n**Action :** [ ] ")}
            className="px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all font-medium"
          >
            + Action
          </button>
          <button
            onClick={() => setContent(c => c + "\n---\n")}
            className="px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all font-medium"
          >
            ─── Séparateur
          </button>
        </div>

        {/* Editor */}
        <textarea
          value={content}
          onChange={e => handleChange(e.target.value)}
          rows={16}
          placeholder={`# Procès Verbal — Réunion\n\nDate : \nParticipants :\n\n## 1. Ordre du jour\n\n...\n\n## 2. Décisions prises\n\n...\n\n## 3. Actions à suivre\n\n- [ ] Tâche 1 — Responsable — Échéance :\n`}
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white font-mono leading-relaxed focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 resize-y min-h-[320px] placeholder:text-gray-600 transition-all"
        />

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>{wordCount} mots</span>
            <span>{charCount} caractères</span>
            {isDirty && (
              <span className="text-amber-400/80">● Modifications non sauvegardées</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={!isDirty || isPending}
              className="rounded-xl border-white/10 bg-transparent text-gray-400 hover:text-white text-xs gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Annuler
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleDownload}
              variant="outline"
              className="rounded-xl border-white/10 bg-transparent text-gray-400 hover:text-white text-xs gap-1.5"
            >
              <Download className="h-3.5 w-3.5" /> Télécharger
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleManualSave}
              disabled={isPending || (!isDirty && status !== "error")}
              className="rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 font-semibold text-xs gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              {isPending ? "Sauvegarde..." : "Sauvegarder le PV"}
            </Button>
          </div>
        </div>

        {/* Preview panel */}
        {content.trim() && (
          <details className="group">
            <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-300 select-none py-2 transition-colors">
              Prévisualisation du contenu ›
            </summary>
            <div className="mt-3 p-4 bg-white/[0.02] border border-white/5 rounded-xl text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed max-h-64 overflow-y-auto">
              {content}
            </div>
          </details>
        )}
      </CardContent>
    </Card>
  );
}

// ── Main Tabs Component ───────────────────────────────────────────────────────
export function MeetingTabs({
  meetingId,
  agendaItems,
  actionItems,
  participants,
  initialPv = "",
}: {
  meetingId: string;
  agendaItems: AgendaItem[];
  actionItems: ActionItem[];
  participants: Participant[];
  initialPv?: string;
}) {
  return (
    <Tabs defaultValue="agenda" className="w-full">
      <TabsList className="grid w-full grid-cols-4 bg-white/5 border border-white/10 rounded-xl p-1">
        <TabsTrigger value="agenda" className="rounded-lg data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
          <List className="w-3.5 h-3.5 mr-1.5 hidden sm:block" /> Agenda
        </TabsTrigger>
        <TabsTrigger value="participants" className="rounded-lg data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
          <Users className="w-3.5 h-3.5 mr-1.5 hidden sm:block" /> Participants
        </TabsTrigger>
        <TabsTrigger value="minutes" className="rounded-lg data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
          <FileText className="w-3.5 h-3.5 mr-1.5 hidden sm:block" /> PV
        </TabsTrigger>
        <TabsTrigger value="actions" className="rounded-lg data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
          <CheckSquare className="w-3.5 h-3.5 mr-1.5 hidden sm:block" /> Actions
        </TabsTrigger>
      </TabsList>

      {/* ── Agenda ── */}
      <TabsContent value="agenda" className="mt-6 space-y-4">
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-white">Ordre du jour</CardTitle>
              <CardDescription className="text-gray-400">Points à aborder durant la réunion</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="border-white/10 text-gray-400 hover:text-white rounded-xl">+ Ajouter</Button>
          </CardHeader>
          <CardContent>
            {agendaItems.length === 0 ? (
              <div className="border border-dashed border-white/10 rounded-xl p-8 text-center text-gray-500 text-sm">
                Aucun point à l'ordre du jour
              </div>
            ) : (
              <div className="space-y-3 mt-2">
                {agendaItems.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border border-white/10 rounded-xl bg-white/[0.02] hover:border-cyan-500/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="bg-cyan-500/10 text-cyan-400 font-bold rounded-full w-7 h-7 flex items-center justify-center text-xs border border-cyan-500/20">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-white">{item.title}</p>
                        <p className="text-xs text-gray-500">Animé par: {item.owner}</p>
                      </div>
                    </div>
                    <Badge className="bg-white/10 text-gray-300 border-0 text-xs">{item.duration} min</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* ── Participants ── */}
      <TabsContent value="participants" className="mt-6">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Invités et Réponses</CardTitle>
          </CardHeader>
          <CardContent>
            {participants.length === 0 ? (
              <div className="border border-dashed border-white/10 rounded-xl p-8 text-center text-gray-500 text-sm">
                Aucun participant invité
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-gray-400">Nom</TableHead>
                    <TableHead className="text-gray-400">Rôle</TableHead>
                    <TableHead className="text-gray-400">Réponse</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants.map((p, i) => (
                    <TableRow key={i} className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-medium text-white">{p.name}</TableCell>
                      <TableCell className="text-gray-400">{p.role}</TableCell>
                      <TableCell>
                        {p.response === "ACCEPTED" ? (
                          <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">Accepté</Badge>
                        ) : p.response === "DECLINED" ? (
                          <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">Refusé</Badge>
                        ) : (
                          <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30">En attente</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* ── PV ── */}
      <TabsContent value="minutes" className="mt-6">
        <PvEditor meetingId={meetingId} initialPv={initialPv} />
      </TabsContent>

      {/* ── Actions ── */}
      <TabsContent value="actions" className="mt-6">
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-white">Plan d&apos;Action</CardTitle>
              <CardDescription className="text-gray-400">Tâches décidées lors de la réunion</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="border-white/10 text-gray-400 hover:text-white rounded-xl">+ Tâche</Button>
          </CardHeader>
          <CardContent>
            {actionItems.length === 0 ? (
              <div className="border border-dashed border-white/10 rounded-xl p-8 text-center text-gray-500 text-sm">
                Aucune action définie
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-gray-400">Tâche</TableHead>
                    <TableHead className="text-gray-400">Responsable</TableHead>
                    <TableHead className="text-gray-400">Échéance</TableHead>
                    <TableHead className="text-gray-400">Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {actionItems.map((action, i) => (
                    <TableRow key={i} className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-medium text-white">{action.task}</TableCell>
                      <TableCell className="text-gray-400">{action.assignee}</TableCell>
                      <TableCell className="text-gray-400 text-sm">
                        {new Date(action.due).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          action.status === "DONE"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }>
                          {action.status === "DONE" ? "Terminé" : "À faire"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
