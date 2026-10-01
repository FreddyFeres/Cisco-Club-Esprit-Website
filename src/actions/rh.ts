"use server";

import { prisma } from "@/lib/prisma";
import { MemberStatus } from "@prisma/client";

export async function getMembers() {
  return prisma.member.findMany({
    include: {
      user: true,
      cell: true,
    }
  });
}

export async function updateMemberStatus(memberId: string, status: MemberStatus) {
  try {
    const member = await prisma.member.update({
      where: { id: memberId },
      data: { status }
    });
    return { success: true, member };
  } catch (error) {
    return { error: "Erreur lors de la mise à jour du membre" };
  }
}
