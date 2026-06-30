import type { AuditEvent } from "@auditx/contracts";

export interface AuditClient {
  log(event: AuditEvent): Promise<void>;
}