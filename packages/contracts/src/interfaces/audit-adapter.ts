import type { AuditEvent } from "./audit-event";

export interface AuditAdapter {
  save(event: AuditEvent): Promise<void>;
}