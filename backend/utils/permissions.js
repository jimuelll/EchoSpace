import { prisma } from "@/lib/prisma";

export async function getUserRole(userId, communityId) {
  const membership = await prisma.membership.findUnique({
    where: {
      userId_communityId: { userId, communityId },
    },
    select: { role: true },
  });

  return membership?.role ?? null;
}