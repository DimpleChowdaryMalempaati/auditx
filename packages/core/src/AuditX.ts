import type { AuditEvent } from "@auditx/contracts";

import { AuditEngine } from "./engine/AuditEngine";
import type { AuditClient } from "./interfaces/audit-client";
import type { AuditConfig } from "./interfaces/audit-config";

export class AuditX implements AuditClient {
  private readonly engine: AuditEngine;

  constructor(config: AuditConfig) {
    this.engine = new AuditEngine(config);
  }

  async log(event: AuditEvent): Promise<void> {
    await this.engine.log(event);
  }
}