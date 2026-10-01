"use server";

import { prisma } from "@/lib/prisma";
import { EventStatus } from "@prisma/client";

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
  status?: EventStatus;
}

export async function getEvents(status?: EventStatus) {
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

export async function createEvent(data: EventInput) {
  try {
    const event = await prisma.event.create({
      data: {
        ...data,
      },
    });
    return { success: true, event };
  } catch (error) {
    return { error: "Erreur lors de la création de l'événement." };
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
