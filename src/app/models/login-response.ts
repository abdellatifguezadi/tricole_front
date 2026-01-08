export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  userId: number;
  username: string;
  email: string;
  role: string;
}