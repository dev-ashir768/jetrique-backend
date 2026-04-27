declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        agentId: number | null;
        roleId: number;
        roleSlug: string;
      };
    }
  }
}

export {};
