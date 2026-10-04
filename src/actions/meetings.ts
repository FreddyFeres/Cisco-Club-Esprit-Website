"use server";

import { prisma } from "@/lib/prisma";

export interface MeetingInput {
  title: string;
  objective?: string;
  type: string;
  startDate: Date;
  duration: number;
  location: string;
  organizerId: string;
}

export async function getMeetingById(id: string) {
  return prisma.meeting.findUnique({
    where: { id },
    include: {
      participants: { include: { user: true } },
      agendaItems: { orderBy: { order: "asc" } },
      minutes: true,
      actionItems: true,
    },
  });
}


export async function createMeeting(data: MeetingInput, participantIds: string[]) {
  try {
    const meeting = await prisma.meeting.create({
      data: {
        ...data,
        participants: {
          create: participantIds.map(id => ({ userId: id, status: "PENDING" }))
        }
      },
    });
    return { success: true, meeting };
  } catch (error) {
    return { error: "Erreur lors de la création de la réunion." };
  }
}

export async function addAgendaItem(meetingId: string, title: string, durationEst: number, order: number) {
  try {
    const item = await prisma.agendaItem.create({
      data: {
        meetingId,
        title,
        durationEst,
        order
      }
    });
    return { success: true, item };
  } catch (error) {
    return { error: "Impossible d'ajouter le point à l'ordre du jour." };
  }
}

export async function updateMeetingMinutes(meetingId: string, content: string) {
  try {
    const minutes = await prisma.meetingMinutes.upsert({
      where: { meetingId },
      update: { content },
      create: { meetingId, content }
    });
    return { success: true, minutes };
  } catch (error) {
    return { error: "Erreur lors de la sauvegarde du PV." };
  }
}

export async function createActionItem(meetingId: string, task: string, assigneeId: string, dueDate: Date) {
  try {
    const action = await prisma.actionItem.create({
      data: {
        meetingId,
        task,
        assigneeId,
        dueDate,
      }
    });
    return { success: true, action };
  } catch (error) {
    return { error: "Erreur lors de la création de l'action." };
  }
}

export async function getMeetings() {
  return prisma.meeting.findMany({
    orderBy: { startDate: 'desc' },
    include: {
      participants: true,
      agendaItems: true,
      minutes: true,
      actionItems: true,
    }
  });
}

export async function deleteMeeting(id: string) {
  try {
    await prisma.meetingParticipant.deleteMany({ where: { meetingId: id } });
    await prisma.agendaItem.deleteMany({ where: { meetingId: id } });
    await prisma.actionItem.deleteMany({ where: { meetingId: id } });
    await prisma.meetingMinutes.deleteMany({ where: { meetingId: id } });
    await prisma.meeting.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    return { error: "Erreur lors de la suppression de la réunion." };
  }
}
