import type { Request } from "express";

import type { AuditActor } from "@auditx/contracts";

import type { AuditMiddlewareOptions } from "../types/audit-middleware-options";

export async function resolveActor(
  request: Request,
  options: AuditMiddlewareOptions
): Promise<AuditActor | undefined> {
  if (!options.getActor) {
    return undefined;
  }

  return await options.getActor(request);
}