import type { AuditEvent } from "@auditx/contracts";

import { AuditEngine } from "../engine/AuditEngine";

import type { AuditProcessor } from "./processors/AuditProcessor";
import { PersistenceProcessor } from "./processors/PersistenceProcessor";

export class AuditPipeline {
  private readonly processors: AuditProcessor[];

  constructor(engine: AuditEngine) {
    this.processors = [new PersistenceProcessor(engine)];
  }

  async process(event: AuditEvent): Promise<void> {
    let currentEvent = event;

    for (const processor of this.processors) {
      currentEvent = await processor.process(currentEvent);
    }
  }
}
