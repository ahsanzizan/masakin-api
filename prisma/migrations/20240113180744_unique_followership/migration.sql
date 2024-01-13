/*
  Warnings:

  - A unique constraint covering the columns `[followerId,followingId]` on the table `followerships` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `followerships_followerId_followingId_key` ON `followerships`(`followerId`, `followingId`);

-- CreateIndex
CREATE INDEX `users_username_email_idx` ON `users`(`username`, `email`);
