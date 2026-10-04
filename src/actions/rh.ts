"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function getMembers() {
  return prisma.member.findMany({
    include: {
      user: true,
      cell: true,
    }
  });
}

export async function updateMemberStatus(memberId: string, status: string) {
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
export async function deleteMember(memberId: string) {
  try {
    const member = await prisma.member.findUnique({ where: { id: memberId } });
    if (!member) return { error: "Membre introuvable" };
    
    // Clean up member related evaluations
    await prisma.evaluation.deleteMany({ where: { memberId } });
    await prisma.member.delete({ where: { id: memberId } });
    
    return { success: true };
  } catch (error) {
    return { error: "Erreur lors de la suppression du membre" };
  }
}

export async function createMember(data: { userId: string, cellId: string, position: string, status: string }) {
  try {
    const member = await prisma.member.create({
      data: {
        userId: data.userId,
        cellId: data.cellId,
        position: data.position,
        status: data.status,
        joinDate: new Date(),
      },
      include: { user: true, cell: true }
    });
    return { success: true, member };
  } catch (error) {
    return { error: "Erreur lors de l'ajout du membre" };
  }
}

export async function createNewMemberManually(data: { firstName: string, lastName: string, email: string, cellId: string, position: string, status: string }) {
  try {
    let user = await prisma.user.findUnique({ where: { email: data.email } });
    
    if (!user) {
      const hash = await bcrypt.hash("Cisco@2024", 10);
      user = await prisma.user.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: "MEMBRE",
          passwordHash: hash
        }
      });
    }

    const existingMember = await prisma.member.findUnique({ where: { userId: user.id } });
    if (existingMember) {
      return { error: "Cet utilisateur est déjà membre." };
    }

    const member = await prisma.member.create({
      data: {
        userId: user.id,
        cellId: data.cellId,
        position: data.position,
        status: data.status,
        joinDate: new Date(),
      },
      include: { user: true, cell: true }
    });
    return { success: true, member };
  } catch (error) {
    return { error: "Erreur lors de l'ajout manuel du membre" };
  }
}

export async function getCells() {
  return prisma.cell.findMany();
}
