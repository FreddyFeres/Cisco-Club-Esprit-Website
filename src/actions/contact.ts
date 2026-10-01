"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitContactMessage(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  try {
    const msg = await prisma.contactMessage.create({ data });
    revalidatePath("/admin/messages");
    return { success: true, msg };
  } catch (error: any) {
    console.error(error);
    return { error: "Erreur lors de l'envoi du message." };
  }
}

export async function getContactMessages() {
  return prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
}

export async function markMessageRead(id: string) {
  try {
    await prisma.contactMessage.update({ where: { id }, data: { isRead: true } });
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteContactMessage(id: string) {
  try {
    await prisma.contactMessage.delete({ where: { id } });
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
