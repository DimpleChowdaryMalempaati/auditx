import type { AuditEvent, TransportContext } from "@auditx/contracts";

import type { AuditClient } from "./interfaces/audit-client";
import type { AuditConfig } from "./interfaces/audit-config";
import { AuditRuntime } from "./runtime/AuditRuntime";

export class AuditX implements AuditClient {
  private readonly runtime: AuditRuntime;

  constructor(config: AuditConfig) {
    this.runtime = AuditRuntime.create(config);
  }

  async log(event: AuditEvent): Promise<void> {
    await this.runtime.engine.log(event);
  }

  async capture(context: TransportContext): Promise<void> {
    try {
      const event = this.runtime.mapper.map(context);

      await this.log(event);
    } catch (error) {
      this.runtime.logger.error("AuditX failed to capture audit event.", error);
    }
  }
}
