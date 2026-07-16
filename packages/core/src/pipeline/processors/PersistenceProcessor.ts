import type { AuditEvent } from "@auditx/contracts";

import { AuditEngine } from "../../engine/AuditEngine";

import type { AuditProcessor } from "./AuditProcessor";

export class PersistenceProcessor implements AuditProcessor {
  constructor(private readonly engine: AuditEngine) {}

  async process(event: AuditEvent): Promise<AuditEvent> {
    await this.engine.log(event);

    return event;
  }
}
