import { User } from './user';

export interface AuthResponse {
  user: User;
  expiresAt: number;
  token: string;
}
