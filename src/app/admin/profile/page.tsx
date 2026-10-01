"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Save, KeyRound, Mail, BookOpen, Cpu } from "lucide-react";
import { updateProfile } from "@/actions/profile";
import { AdminShell } from "@/components/admin-shell";

const inputClass =
  "flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed";
const labelClass = "block text-sm font-medium text-gray-300 mb-1.5";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (status === "loading") {
    return (
      <AdminShell title="Mon Profil">
        <div className="flex items-center justify-center h-full">
          <div className="h-10 w-10 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
        </div>
      </AdminShell>
    );
  }

  if (status === "unauthenticated" || !session) {
    return (
      <AdminShell title="Mon Profil">
        <div className="flex items-center justify-center h-full text-gray-400">Accès non autorisé.</div>
      </AdminShell>
    );
  }

  const [firstName, ...lastNameParts] = (session.user?.name ?? "").split(" ");
  const lastName = lastNameParts.join(" ");

  const initials = session.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await updateProfile(formData);
      if (res.error) setError(res.error);
      else setSuccess(true);
    } catch {
      setError("Une erreur inattendue s'est produite.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminShell title="Mon Profil" subtitle="Gérez vos informations personnelles et votre sécurité">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto space-y-6 pb-12"
      >
        {/* Avatar card */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-md overflow-hidden">
          <div className="h-24 bg-gradient-to-br from-cyan-900/40 via-black to-purple-900/40" />
          <CardContent className="pt-0 -mt-12 pb-6 flex items-end gap-5">
            <div className="relative shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur opacity-70" />
              <div className="relative h-20 w-20 rounded-full bg-gray-900 border-4 border-black flex items-center justify-center text-cyan-400 font-extrabold text-2xl">
                {initials}
              </div>
            </div>
            <div className="pb-1">
              <h2 className="text-xl font-bold text-white">{session.user?.name}</h2>
              <p className="text-sm text-cyan-400 font-medium">{(session.user as any)?.role ?? "Membre"}</p>
              <p className="text-xs text-gray-500 mt-0.5">{session.user?.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Feedback */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-green-500/30 bg-green-500/10 text-green-300 text-sm">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            Profil mis à jour avec succès !
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white">Informations Personnelles</CardTitle>
              <CardDescription className="text-gray-400">
                Laissez le mot de passe vide pour conserver l&apos;actuel.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">

              {/* Name row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Prénom</label>
                  <input name="firstName" type="text" required defaultValue={firstName} className={inputClass} placeholder="Prénom" />
                </div>
                <div>
                  <label className={labelClass}>Nom</label>
                  <input name="lastName" type="text" required defaultValue={lastName} className={inputClass} placeholder="Nom de famille" />
                </div>
              </div>

              {/* Level + Specialty */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}><BookOpen className="inline h-3.5 w-3.5 mr-1 mb-0.5" />Niveau d&apos;études</label>
                  <select name="level" className={inputClass + " cursor-pointer"}>
                    <option value="" className="bg-gray-900">Sélectionner</option>
                    {["1ère année", "2ème année", "3ème année", "4ème année", "5ème année"].map((y) => (
                      <option key={y} value={y} className="bg-gray-900">{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}><Cpu className="inline h-3.5 w-3.5 mr-1 mb-0.5" />Spécialité</label>
                  <input name="specialty" type="text" className={inputClass} placeholder="Ex: Réseaux & Télécom" />
                </div>
              </div>

              {/* Email (readonly) */}
              <div>
                <label className={labelClass}><Mail className="inline h-3.5 w-3.5 mr-1 mb-0.5" />Email (non modifiable)</label>
                <input type="email" value={session.user?.email ?? ""} disabled className={inputClass} />
              </div>

              {/* Bio */}
              <div>
                <label className={labelClass}>Bio</label>
                <textarea
                  name="bio"
                  rows={3}
                  className={inputClass + " resize-none h-auto py-3"}
                  placeholder="Décrivez-vous en quelques mots..."
                />
              </div>

              {/* Password */}
              <div>
                <label className={labelClass}><KeyRound className="inline h-3.5 w-3.5 mr-1 mb-0.5" />Nouveau mot de passe</label>
                <input
                  name="password"
                  type="password"
                  className={inputClass}
                  placeholder="Laissez vide pour ne pas changer"
                />
              </div>

            </CardContent>
            <CardFooter className="flex justify-end gap-3 border-t border-white/10 pt-6">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-white/20 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10"
                onClick={() => window.history.back()}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-cyan-500 text-black hover:bg-cyan-400 font-bold rounded-xl px-8 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Enregistrement...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="h-4 w-4" /> Enregistrer
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </motion.div>
    </AdminShell>
  );
}
