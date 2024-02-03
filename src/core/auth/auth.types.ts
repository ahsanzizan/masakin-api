export interface AuthUser {
  sub: string;
  username: string;
  email: string;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}
