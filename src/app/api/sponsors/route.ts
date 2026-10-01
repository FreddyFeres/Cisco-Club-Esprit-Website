import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const sponsors = await prisma.sponsor.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(sponsors);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sponsor = await prisma.sponsor.create({ data: body });
    return NextResponse.json(sponsor, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
