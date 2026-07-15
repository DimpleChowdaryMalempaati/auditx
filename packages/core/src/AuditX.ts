import type { AuditEvent, TransportContext } from "@auditx/contracts";

import { AuditEngine } from "./engine/AuditEngine";
import { AuditEventMapper } from "./engine/AuditEventMapper";
import type { AuditClient } from "./interfaces/audit-client";
import type { AuditConfig } from "./interfaces/audit-config";

export class AuditX implements AuditClient {
  private readonly engine: AuditEngine;

  private readonly mapper: AuditEventMapper;

  constructor(config: AuditConfig) {
    this.engine = new AuditEngine(config);
    this.mapper = new AuditEventMapper();
  }

  async log(event: AuditEvent): Promise<void> {
    await this.engine.log(event);
  }

  async capture(context: TransportContext): Promise<void> {
    const event = this.mapper.map(context);

    await this.log(event);
  }
}
