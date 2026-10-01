"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import {
  Activity, LayoutDashboard, BarChart2, Users,
  CalendarDays, Wallet, Presentation, LogOut, UserCircle, Globe, ShieldAlert
} from "lucide-react";

const navItems = [
  { href: "/admin",             label: "Vue d'ensemble",       icon: LayoutDashboard, exact: true },
  { href: "/admin/analytics",   label: "Analytics",            icon: BarChart2 },
  { href: "/admin/permissions", label: "Autorisations",        icon: ShieldAlert },
  { href: "/admin/rh",          label: "Ressources Humaines",  icon: Users },
  { href: "/admin/events",      label: "Événements",           icon: CalendarDays },
  { href: "/admin/sponsors",    label: "Sponsoring",           icon: Wallet },
  { href: "/admin/meetings",    label: "Réunions",             icon: Presentation },
  { href: "/events",            label: "Page publique",        icon: Globe, exact: true },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  return (
    <aside className="w-72 border-r border-white/10 bg-white/[0.02] backdrop-blur-xl hidden md:flex flex-col relative z-20 shrink-0">
      {/* Logo */}
      <div className="h-20 flex items-center px-8 border-b border-white/10">
        <Link href="/" className="font-extrabold text-2xl flex items-center gap-3 group">
          <img
            src="/cisco-logo.jpg"
            alt="Cisco Club ESPRIT"
            className="h-10 w-10 rounded-full object-cover border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all"
          />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Cisco Club</span>
        </Link>
      </div>

      {/* Nav */}
      <div className="flex-1 py-8 px-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 px-4">Menu Principal</div>
        {navItems
          .filter(n => n.href !== "/events")
          .filter(n => {
            // Seul Feres peut voir Analytics, Autorisations et RH
            const isAdminRoute = n.href === "/admin/analytics" || n.href === "/admin/permissions" || n.href === "/admin/rh";
            if (isAdminRoute && session?.user?.email !== "feresfatmi07@gmail.com") return false;
            return true;
          })
          .map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 w-full px-4 h-12 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-cyan-400" : ""}`} />
              {label}
            </Link>
          );
        })}

        {/* Divider + Public link */}
        <div className="pt-4 mt-4 border-t border-white/10">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 px-4">Site Public</div>
          <Link href="/events"
            className="flex items-center gap-3 w-full px-4 h-10 rounded-xl text-sm font-medium text-gray-500 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            <Globe className="h-4 w-4" />
            Voir la page événements
          </Link>
          <Link href="/"
            className="flex items-center gap-3 w-full px-4 h-10 rounded-xl text-sm font-medium text-gray-500 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            <Activity className="h-4 w-4" />
            Aller au site
          </Link>
        </div>
      </div>

      {/* User + Logout */}
      <div className="p-4 border-t border-white/10 space-y-1">
        {/* Profile link */}
        <Link
          href="/admin/profile"
          className={`flex items-center gap-3 w-full px-4 h-12 rounded-xl text-sm font-medium transition-all duration-200 ${
            pathname === "/admin/profile"
              ? "bg-white/10 text-white"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          {/* Mini avatar */}
          <div className="relative shrink-0">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur opacity-40" />
            <div className="relative h-7 w-7 rounded-full bg-gray-800 flex items-center justify-center text-cyan-400 font-bold text-xs border border-black">
              {initials}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-semibold text-white leading-none">{session?.user?.name ?? "Mon Compte"}</p>
            <p className="truncate text-[11px] text-gray-500 mt-0.5">{session?.user?.email ?? ""}</p>
          </div>
          <UserCircle className="h-4 w-4 shrink-0 text-gray-500" />
        </Link>

        {/* Signout */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 w-full px-4 h-11 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

export function AdminShell({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) {
  const { data: session } = useSession();
  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  return (
    <div className="flex min-h-screen w-full bg-black text-white font-sans overflow-hidden">
      {/* Background ambiance */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-900/20 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px] translate-y-1/3" />
      </div>

      <AdminSidebar />

      <main className="flex-1 flex flex-col relative z-10 h-screen overflow-hidden">
        {/* Top header */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-white/10 bg-black/40 backdrop-blur-md shrink-0">
          <div>
            <h1 className="font-bold text-2xl text-white">
              {title.split(" ")[0]}{" "}
              <span className="text-cyan-400 font-normal">{title.split(" ").slice(1).join(" ")}</span>
            </h1>
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          </div>

          {/* Avatar → profile */}
          <Link href="/admin/profile">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur opacity-40 group-hover:opacity-80 transition duration-300" />
              <div className="relative h-10 w-10 rounded-full bg-gray-800 border-2 border-black flex items-center justify-center text-cyan-400 font-bold text-sm">
                {initials}
              </div>
            </div>
          </Link>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
