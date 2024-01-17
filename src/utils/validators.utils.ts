import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/lib/prisma/prisma.service';

export async function validateEntityById(
  id: string,
  entityModel: Prisma.ModelName,
) {
  const prismaService = new PrismaService();
  const findEntity = await prismaService[entityModel.toLowerCase()].findUnique({
    where: { id },
  });

  console.log(findEntity);
  return Boolean(findEntity);
}
