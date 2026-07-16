import type { AuditEvent } from "@auditx/contracts";

export interface AuditProcessor {
  process(event: AuditEvent): Promise<AuditEvent>;
}
