import { Followership } from '@prisma/client';
import { PaginatedResult } from 'src/lib/prisma/paginator';

export const followershipsSeeder: Followership[] = [
  {
    id: '60ded7dd-dbd8-41ff-a388-52bbee0eee7f',
    createdAt: new Date(),
    followerId: '70d1c5a7-febf-4600-a64f-3dfa68041cc5',
    followingId: '728df0f8-8278-448f-b171-ab9e831979a9',
  },
  {
    id: '40ded7dd-abd8-41fd-a389-52bbne0exe7e',
    createdAt: new Date(),
    followerId: '728df0f8-8278-448f-b171-ab9e831979a9',
    followingId: '70d1c5a7-febf-4600-a64f-3dfa68041cc5',
  },
];

export const paginatedFollowershipsSeeder: PaginatedResult<Followership> = {
  data: followershipsSeeder,
  meta: {
    total: followershipsSeeder.length,
    lastPage: 1,
    currentPage: 1,
    perPage: 20,
    prev: null,
    next: null,
  },
};

export const followershipSeeder: Followership = followershipsSeeder[0];
