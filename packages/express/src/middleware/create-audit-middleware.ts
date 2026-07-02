import type { RequestHandler } from "express";

import { AuditX } from "@auditx/core";

import { AuditMiddleware } from "./AuditMiddleware";
import type { AuditMiddlewareOptions } from "../types/audit-middleware-options";

export function createAuditMiddleware(
  audit: AuditX,
  options: AuditMiddlewareOptions = {}
): RequestHandler {
  return new AuditMiddleware(audit, options).handler();
}