import type { Request } from "express";

import type { AuditActor } from "@auditx/contracts";

export interface AuditMiddlewareOptions {
  /**
   * Routes to include for auditing.
   * Example:
   * ["/api", "/users"]
   */
  include?: string[];

  /**
   * Routes to exclude from auditing.
   * Example:
   * ["/health", "/metrics"]
   */
  exclude?: string[];

  /**
   * HTTP methods to audit.
   * Example:
   * ["POST", "PUT", "PATCH", "DELETE"]
   */
  methods?: string[];

  /**
   * Resolves the authenticated user from the request.
   */
  getActor?: (
    request: Request
  ) => AuditActor | undefined | Promise<AuditActor | undefined>;
}