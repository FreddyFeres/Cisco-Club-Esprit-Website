"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// DTO pour un événement
export interface EventInput {
  title: string;
  description: string;
  category: string;
  startDate: Date;
  endDate: Date;
  location: string;
  capacity: number;
  budget?: number;
  status?: string;
}

export async function getEvents(status?: string) {
  return prisma.event.findMany({
    where: status ? { status } : undefined,
    orderBy: { startDate: "asc" },
  });
}

export async function getEventById(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      registrations: {
        include: { user: true }
      }
    }
  });
}

export async function createEvent(formData: FormData) {
  try {
    const startDate = new Date(formData.get("startDate") as string);
    const endDate = new Date(formData.get("endDate") as string);
    const capacity = parseInt(formData.get("capacity") as string, 10);
    const budget = formData.get("budget") ? parseFloat(formData.get("budget") as string) : undefined;

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return { error: "Dates invalides." };
    }
    if (endDate < startDate) {
      return { error: "La date de fin doit être après la date de début." };
    }

    const event = await prisma.event.create({
      data: {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        location: formData.get("location") as string,
        capacity,
        budget,
        startDate,
        endDate,
        status: (formData.get("status") as string) || "BROUILLON",
      },
    });
    revalidatePath("/events");
    revalidatePath("/admin/events");
    return { success: true, event };
  } catch (error) {
    console.error(error);
    return { error: "Erreur lors de la création de l'événement." };
  }
}

export async function updateEvent(id: string, formData: FormData) {
  try {
    const startDate = new Date(formData.get("startDate") as string);
    const endDate = new Date(formData.get("endDate") as string);
    const capacity = parseInt(formData.get("capacity") as string, 10);
    const budget = formData.get("budget") ? parseFloat(formData.get("budget") as string) : undefined;

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return { error: "Dates invalides." };
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        location: formData.get("location") as string,
        capacity,
        budget,
        startDate,
        endDate,
        status: (formData.get("status") as string) || "BROUILLON",
      },
    });
    revalidatePath("/events");
    revalidatePath("/admin/events");
    return { success: true, event };
  } catch (error) {
    console.error(error);
    return { error: "Erreur lors de la mise à jour de l'événement." };
  }
}

export async function deleteEvent(id: string) {
  try {
    // Delete dependent records first
    await prisma.attendance.deleteMany({ where: { eventId: id } });
    await prisma.registration.deleteMany({ where: { eventId: id } });
    await prisma.event.delete({ where: { id } });
    revalidatePath("/events");
    revalidatePath("/admin/events");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Erreur lors de la suppression de l'événement." };
  }
}

export async function registerForEvent(userId: string, eventId: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { registrations: true }
    });

    if (!event) return { error: "Événement introuvable." };

    const isWaitlist = event.registrations.length >= event.capacity;

    const registration = await prisma.registration.create({
      data: {
        userId,
        eventId,
        isWaitlist,
      }
    });

    return { success: true, registration, isWaitlist };
  } catch (error) {
    return { error: "Impossible de s'inscrire ou inscription existante." };
  }
}
