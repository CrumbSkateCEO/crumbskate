export {};

declare global {
  namespace Express {
    export interface Request {
      usuario?: {
        id: number;
        email: string;
        rol: string;
      };
    }
  }
}
