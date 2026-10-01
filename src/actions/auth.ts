"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerUser(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const level = formData.get("level") as string;
  const specialty = formData.get("specialty") as string;

  if (!email || !password || !firstName || !lastName) {
    return { error: "Tous les champs obligatoires doivent être remplis." };
  }

  // Vérifier si l'utilisateur existe
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Cet email est déjà utilisé." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        level,
        specialty,
      },
    });
    return { success: true };
  } catch (error) {
    return { error: "Erreur lors de la création du compte." };
  }
}
