declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        roleId: number;
        roleSlug: string;
      };
    }
  }
}

export {};
