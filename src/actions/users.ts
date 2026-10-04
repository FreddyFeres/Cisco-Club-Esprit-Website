"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
    }
  });
}

export async function updateUserRole(userId: string, newRole: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    });
    revalidatePath("/admin/permissions");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Erreur de mise à jour du rôle" };
  }
}

export async function deleteUser(userId: string) {
  try {
    // Delete related records to prevent foreign key constraint failures
    await prisma.attendance.deleteMany({ where: { userId } });
    await prisma.registration.deleteMany({ where: { userId } });
    await prisma.meetingParticipant.deleteMany({ where: { userId } });
    await prisma.evaluation.deleteMany({ where: { memberId: userId } });
    await prisma.actionItem.deleteMany({ where: { assigneeId: userId } });
    await prisma.member.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
    revalidatePath("/admin/permissions");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Erreur de suppression de l'utilisateur" };
  }
}

export async function createUser(data: any) {
  try {
    const bcrypt = require("bcryptjs");
    const passwordHash = await bcrypt.hash("Cisco@2024", 10);
    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
        passwordHash,
      }
    });
    revalidatePath("/admin/permissions");
    return { success: true, user };
  } catch (error: any) {
    return { error: error.message || "Erreur de création de l'utilisateur" };
  }
}
