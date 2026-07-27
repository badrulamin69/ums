export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  email: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface UserResponse {
  id: number;
  email: string;
  enabled: boolean;
  roles: string[];
}

export interface DecodedToken {
  sub: string;
  type: string;
  userId?: number;
  roles?: string[];
  iat: number;
  exp: number;
}
