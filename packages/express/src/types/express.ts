import type { RequestAudit } from "../audit/RequestAudit";

declare global {
  namespace Express {
    interface Request {
      /**
       * Request-scoped audit context.
       */
      audit: RequestAudit;
    }
  }
}

export {};