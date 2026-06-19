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
declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        displayName: string;
        username: string;
        email: string;
        isEmailVerified: boolean;
        profilePic: string | null;
        lastSeen: Date | null;
      };
    }
  }
}
