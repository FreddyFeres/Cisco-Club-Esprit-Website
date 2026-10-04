"use server";

import { prisma } from "@/lib/prisma";

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

export async function updateSponsor(sponsorId: string, data: any) {
  try {
    const sponsor = await prisma.sponsor.update({
      where: { id: sponsorId },
      data
    });
    return { success: true, sponsor };
  } catch (error) {
    return { error: "Erreur de mise à jour du sponsor" };
  }
}

export async function deleteSponsor(sponsorId: string) {
  try {
    await prisma.deliverable.deleteMany({ where: { deal: { sponsorId } } });
    await prisma.deal.deleteMany({ where: { sponsorId } });
    await prisma.sponsorContact.deleteMany({ where: { sponsorId } });
    await prisma.sponsor.delete({ where: { id: sponsorId } });
    return { success: true };
  } catch (error) {
    return { error: "Erreur lors de la suppression du sponsor" };
  }
}
