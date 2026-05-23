"use server";

import db from "@/lib/db";
import { User } from "@/lib/generated/prisma/client";
import { currentUser } from "@clerk/nextjs/server";

export const onboardUser = async () => {
  const userClerk = await currentUser();
  if (!userClerk) {
    return {
      success: false,
      message: "User not found",
    };
  }

  const { id, firstName, lastName, emailAddresses, imageUrl } = userClerk;

  try {
    const newUser = await db.user.upsert({
      where: {
        clerkId: id,
      },
      update: {
        name: `${firstName} ${lastName}`,
        email: emailAddresses[0].emailAddress,
        imageUrl: imageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      create: {
        clerkId: id,
        name: `${firstName} ${lastName}`,
        email: emailAddresses[0].emailAddress,
        imageUrl: imageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      message: "User onboarded successfully",
      user: newUser,
    };
  } catch (error) {
    console.error("Failed to onboard user:", error);
    return {
      success: false,
      message: "Failed to onboard user",
    };
  }
};

export const getCurrentUser = async () => {
  const userClerk = await currentUser();
  if (!userClerk) {
    return {
      success: false,
      message: "User not found",
    };
  }

  const user = await db.user.findUnique({
    where: {
      clerkId: userClerk.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      imageUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return {
      success: false,
      message: "User not found",
    };
  }

  return {
    success: true,
    message: "User found",
    user: user,
  };
};
