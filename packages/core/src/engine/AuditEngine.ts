import type { AuditConfig } from "../interfaces/audit-config";
import type { AuditEvent } from "@auditx/contracts";

export class AuditEngine {
  constructor(private readonly config: AuditConfig) {}

  async log(event: AuditEvent): Promise<void> {
    for (const adapter of this.config.adapters) {
      await adapter.persist(event);
    }
  }
}