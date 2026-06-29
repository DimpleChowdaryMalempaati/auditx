import type { AuditEvent } from "./audit-event";

export interface AuditAdapter {
  readonly name: string;
  readonly version: string;

  persist(event: AuditEvent): Promise<void>;
}