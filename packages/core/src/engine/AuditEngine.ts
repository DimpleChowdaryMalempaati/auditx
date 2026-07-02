import type { AuditEvent } from "@auditx/contracts";

import type { AuditConfig } from "../interfaces/audit-config";

export class AuditEngine {
  constructor(private readonly config: AuditConfig) {}

  async log(event: AuditEvent): Promise<void> {
    const enrichedEvent = this.enrich(event);

    for (const adapter of this.config.adapters) {
      await adapter.persist(enrichedEvent);
    }
  }

  /**
   * Enriches every audit event before persistence.
   *
   * All entry points (capture() and log()) flow through here,
   * ensuring consistent metadata.
   */
  private enrich(event: AuditEvent): AuditEvent {
    return {
      ...event,
      metadata: {
        ...event.metadata,
        application: {
          name: this.config.application.name,
          version: this.config.application.version,
          environment: this.config.application.environment,
        },
      },
    };
  }
}
