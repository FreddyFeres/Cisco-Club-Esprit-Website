"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [members, events, sponsors, meetings, attendance] = await Promise.all([
    prisma.member.count({ where: { status: "ACTIF" } }),
    prisma.event.count(),
    prisma.sponsor.findMany({ select: { tier: true, status: true } }),
    prisma.meeting.count(),
    prisma.attendance.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
  ]);

  const totalPresent  = attendance.find(a => a.status === "PRESENT")?._count.status ?? 0;
  const totalAttendance = attendance.reduce((s, a) => s + a._count.status, 0);
  const attendanceRate  = totalAttendance > 0 ? Math.round((totalPresent / totalAttendance) * 100) : 0;

  const totalFunds = await prisma.deal.aggregate({ _sum: { amountReceived: true } });

  const sponsorsByStatus = sponsors.reduce((acc: Record<string, number>, s) => {
    acc[s.status] = (acc[s.status] ?? 0) + 1;
    return acc;
  }, {});

  return {
    membersActive:    members,
    eventsTotal:      events,
    meetingsTotal:    meetings,
    attendanceRate,
    fundsRaised:      totalFunds._sum.amountReceived ?? 0,
    sponsorsActive:   sponsorsByStatus["ACTIF"] ?? 0,
    sponsorsTotal:    sponsors.length,
  };
}

export async function getRecentEvents() {
  return prisma.event.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, title: true, status: true, startDate: true, category: true, capacity: true },
  });
}

export async function getRecentMeetings() {
  return prisma.meeting.findMany({
    orderBy: { startDate: "desc" },
    take: 5,
    select: {
      id: true, title: true, type: true, startDate: true, location: true,
      participants: { select: { userId: true } },
    },
  });
}

export async function getRecentSponsors() {
  return prisma.sponsor.findMany({
    orderBy: { name: "asc" },
    take: 5,
    select: { id: true, name: true, tier: true, status: true },
  });
}

// ── Attendance CRUD ─────────────────────────────────────────────────────────

export async function getAttendanceForEvent(eventId: string) {
  return prisma.attendance.findMany({
    where: { eventId },
    include: { user: { select: { id: true, firstName: true, lastName: true, role: true } } },
  });
}

export async function getEventsWithAttendance() {
  return prisma.event.findMany({
    orderBy: { startDate: "desc" },
    select: {
      id: true, title: true, startDate: true,
      _count: { select: { attendances: true } },
    },
  });
}

export async function upsertAttendance(
  eventId: string,
  userId: string,
  status: "PRESENT" | "ABSENT" | "RETARD" | "EXCUSE",
  method: "QR" | "MANUAL" | "JUSTIFICATIF" = "MANUAL"
) {
  try {
    await prisma.attendance.upsert({
      where: { userId_eventId: { userId, eventId } },
      update: { status, scanMethod: method },
      create: { eventId, userId, status, scanMethod: method },
    });
    return { success: true };
  } catch (error) {
    return { error: "Erreur lors de l'enregistrement de la présence" };
  }
}

export async function bulkCreateAttendance(eventId: string, userIds: string[]) {
  try {
    // Create ABSENT entries for all registered users (then update individually)
    await Promise.all(
      userIds.map(userId =>
        prisma.attendance.upsert({
          where: { userId_eventId: { userId, eventId } },
          update: {},
          create: {
            eventId,
            userId,
            status: "ABSENT",
            scanMethod: "MANUAL",
          },
        })
      )
    );
    return { success: true };
  } catch (error) {
    return { error: "Erreur lors de l'initialisation du pointage" };
  }
}
