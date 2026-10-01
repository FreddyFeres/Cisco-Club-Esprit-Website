"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitCandidature(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  level: string;
  specialty?: string;
  cell: string;
  motivation?: string;
}) {
  try {
    const candidature = await prisma.candidature.create({ data });
    revalidatePath("/admin/recrutement");
    return { success: true, candidature };
  } catch (error: any) {
    console.error(error);
    return { error: "Erreur lors de l'envoi de la candidature." };
  }
}

export async function getCandidatures() {
  return prisma.candidature.findMany({ orderBy: { createdAt: "desc" } });
}

export async function updateCandidatureStatus(id: string, status: string) {
  try {
    await prisma.candidature.update({ where: { id }, data: { status } });
    revalidatePath("/admin/recrutement");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteCandidature(id: string) {
  try {
    await prisma.candidature.delete({ where: { id } });
    revalidatePath("/admin/recrutement");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
