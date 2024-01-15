import { PrismaService } from 'src/lib/prisma/prisma.service';

export async function validateUserById(
  prismaService: PrismaService,
  userId: string,
) {
  const findUser = await prismaService.user.findUnique({
    where: { id: userId },
  });

  return Boolean(findUser);
}
