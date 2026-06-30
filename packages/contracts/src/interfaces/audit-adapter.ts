import type { AuditEvent } from "./audit-event";

export interface AuditAdapter {
  persist(event: AuditEvent): Promise<void>;
}