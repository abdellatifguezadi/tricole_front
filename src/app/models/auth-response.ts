export interface AuthResponse {
  userId: number;
  username: string;
  email: string;
  fullName?: string;
  role: string;
  authorities: string[];
}

