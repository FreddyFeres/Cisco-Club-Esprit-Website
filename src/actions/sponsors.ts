"use server";

import { prisma } from "@/lib/prisma";
import { SponsorStatus } from "@prisma/client";

export async function getSponsors() {
  return prisma.sponsor.findMany({
    include: {
      contacts: true,
      deals: true,
    }
  });
}

export async function createSponsor(data: { name: string, sector?: string, tier?: string, website?: string }) {
  try {
    const sponsor = await prisma.sponsor.create({ data });
    return { success: true, sponsor };
  } catch (error) {
    return { error: "Impossible de créer le sponsor" };
  }
}

export async function updateSponsorStatus(sponsorId: string, status: SponsorStatus) {
  try {
    const sponsor = await prisma.sponsor.update({
      where: { id: sponsorId },
      data: { status }
    });
    return { success: true, sponsor };
  } catch (error) {
    return { error: "Erreur de mise à jour" };
  }
}
