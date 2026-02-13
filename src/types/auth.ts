export interface LoginCredentials {
  email: string;
  contraseña: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface UserData {
  id: string;
  email: string;
  tipo_usuario: string;
  exp: number;
  nombre?: string;
  rol?: string;
}

export interface ApiError {
  detail: string;
}
