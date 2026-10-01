"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      const { getSession } = await import("next-auth/react");
      const session = await getSession();
      
      const adminRoles = ["ADMIN", "RH", "TRESORIER_SPONSORING", "RESPONSABLE_CELLULE"];
      
      if (session?.user?.role && adminRoles.includes(session.user.role)) {
        router.push("/admin");
      } else {
        router.push("/");
      }
      router.refresh();
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-sans overflow-hidden bg-black">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 h-full w-full">
        <div className="absolute inset-0 bg-black/70 z-10 backdrop-blur-[5px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-black to-black z-10" />
        <video autoPlay loop muted playsInline className="object-cover w-full h-full opacity-40">
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-20 w-full max-w-md px-4"
      >
        <Card className="bg-black/40 border-white/10 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="space-y-3 text-center pt-8 pb-4">
            <div className="flex justify-center mb-2">
              <div className="h-16 w-16 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30">
                <Activity className="h-8 w-8 text-cyan-400" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-white">Connexion</CardTitle>
            <CardDescription className="text-gray-400 text-sm">
              Accédez à votre espace Cisco Club ESPRIT
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5 px-8">
              {error && (
                <div className="p-3 text-sm text-red-200 bg-red-500/20 border border-red-500/30 rounded-lg">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                  placeholder="prenom.nom@esprit.tn"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300" htmlFor="password">Mot de passe</label>
                  <a href="#" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Oublié ?</a>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 px-8 pb-8 pt-4">
              <Button type="submit" className="w-full h-12 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 font-semibold shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all" disabled={loading}>
                {loading ? "Connexion en cours..." : (
                  <>Se connecter <ArrowRight className="ml-2 h-4 w-4" /></>
                )}
              </Button>
              <div className="text-sm text-center text-gray-400">
                Pas encore membre ? <Link href="/auth/register" className="text-cyan-400 hover:text-cyan-300 font-medium ml-1">S'inscrire</Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
