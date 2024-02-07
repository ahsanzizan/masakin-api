import { User } from '@prisma/client';

export type FollowershipWithFollower = {
  id: string;
  createdAt: Date;
  followerId: string;
  followingId: string;
  follower: User;
};

export type FollowershipWithFollowing = {
  id: string;
  createdAt: Date;
  followerId: string;
  followingId: string;
  following: User;
};
