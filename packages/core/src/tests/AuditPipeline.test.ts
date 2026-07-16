import { describe, expect, it, vi } from "vitest";

import type { AuditEvent } from "@auditx/contracts";
import { AuditAction, AuditStatus } from "@auditx/contracts";

import { AuditEngine } from "../engine/AuditEngine";
import { AuditPipeline } from "../pipeline/AuditPipeline";

describe("AuditPipeline", () => {
  it("passes the audit event to the persistence processor", async () => {
    const log = vi.fn().mockResolvedValue(undefined);

    const engine = {
      log,
    } as Pick<AuditEngine, "log">;

    const pipeline = new AuditPipeline(engine as AuditEngine);

    const event: AuditEvent = {
      timestamp: new Date(),
      action: AuditAction.CREATE,
      status: AuditStatus.SUCCESS,
      resource: {
        type: "User",
        id: "123",
      },
    };

    await pipeline.process(event);

    expect(log).toHaveBeenCalledOnce();
    expect(log).toHaveBeenCalledWith(event);
  });
});
