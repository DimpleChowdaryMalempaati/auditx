import type {
  AuditEvent,
  TransportContext,
} from "@auditx/contracts";

export interface AuditClient {
  /**
   * Persists a fully constructed audit event.
   */
  log(event: AuditEvent): Promise<void>;

  /**
   * Captures transport context and lets AuditX
   * convert it into an AuditEvent.
   */
  capture(context: TransportContext): Promise<void>;
}