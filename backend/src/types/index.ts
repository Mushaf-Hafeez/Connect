export interface CustomError extends Error {
  status?: number;
  errors?: {
    field: string;
    message: string;
  }[];
}

export interface Payload {
  id: string;
  username: string;
  email: string;
  isEmailVerified: boolean;
}
