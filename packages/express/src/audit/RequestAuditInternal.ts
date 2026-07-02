import type { AuditContext } from "@auditx/contracts";

import type { RequestAudit } from "./RequestAudit";

/**
 * Internal request audit contract used by the framework.
 *
 * Extends the public RequestAudit API with the ability to
 * build an immutable AuditContext for downstream processing.
 */
export interface RequestAuditInternal extends RequestAudit {
  build(): AuditContext;
}