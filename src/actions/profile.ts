"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    return { error: "Non autorisé" };
  }

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const phone = formData.get("phone") as string;
  const bio = formData.get("bio") as string;
  const level = formData.get("level") as string;
  const specialty = formData.get("specialty") as string;
  const password = formData.get("password") as string;

  if (!firstName || !lastName) {
    return { error: "Le prénom et le nom sont obligatoires." };
  }

  try {
    const updateData: any = {
      firstName,
      lastName,
      phone: phone || null,
      bio: bio || null,
      level: level || null,
      specialty: specialty || null,
    };

    if (password && password.trim().length > 0) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return { success: true };
  } catch (error) {
    console.error("Profile update error:", error);
    return { error: "Erreur lors de la mise à jour du profil." };
  }
}
