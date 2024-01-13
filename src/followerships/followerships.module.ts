import { Module } from '@nestjs/common';
import { FollowershipsController } from './followerships.controller';
import { FollowershipsService } from './followerships.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FollowershipsController],
  providers: [FollowershipsService],
})
export class FollowershipsModule {}
