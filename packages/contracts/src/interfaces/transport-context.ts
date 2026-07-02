import type { AuditActor } from "./audit-actor";
import type { AuditContext } from "./audit-context";

export interface TransportContext {
  request: {
    method: string;

    endpoint: string;

    ip?: string;

    userAgent?: string;

    requestId?: string;

    headers?: Record<string, string | string[] | undefined>;

    query?: Record<string, unknown>;

    params?: Record<string, unknown>;

    body?: unknown;
  };

  response: {
    statusCode: number;

    duration: number;
  };

  /**
   * Authenticated actor associated with the request.
   */
  actor?: AuditActor;

  /**
   * Business-specific audit information collected during
   * request execution.
   */
  auditContext?: AuditContext;
}
