import type { AuditActor } from "./audit-actor";
import type { AuditResource } from "./audit-resource";
import type { AuditState } from "./audit-state";

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

  actor?: AuditActor;

  /**
   * Resource affected by the operation.
   * Optional because the transport layer may not always know it.
   */
  resource?: AuditResource;

  /**
   * Before/after state of the resource.
   * Optional because applications may choose not to provide it.
   */
  state?: AuditState;

  /**
   * Additional transport/application metadata.
   */
  metadata?: Record<string, unknown>;
}