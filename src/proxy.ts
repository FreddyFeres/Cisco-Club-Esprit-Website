import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    const email = token?.email;
    const role = token?.role as string;

    const isSuperAdmin = email === "feresfatmi07@gmail.com";
    const boardRoles = ["PRESIDENT", "VICE_PRESIDENT", "SECRETAIRE_GENERAL", "RH", "TRESORIER_SPONSORING", "RESPONSABLE_CELLULE"];
    const isBoard = boardRoles.includes(role) || isSuperAdmin;
    const isMember = !!token;

    // 1. ADMIN ACCESS (Only Feres)
    // Analytics, Permissions et RH sont réservés à l'admin
    if ((path.startsWith("/admin/analytics") || path.startsWith("/admin/permissions") || path.startsWith("/admin/rh")) && !isSuperAdmin) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // 2. BOARD ACCESS (Board + Admin)
    // Le reste du panel admin est accessible par le Board
    if (path.startsWith("/admin") && !isBoard) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    // 3. MEMBER ACCESS
    if (path.startsWith("/member") && !isMember) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/member/:path*"],
};
