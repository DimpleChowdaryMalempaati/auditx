import type { AuditAction } from "../enums/audit-action";
import type { AuditResource } from "./audit-resource";
import type { AuditState } from "./audit-state";

export interface AuditContext {
  /**
   * Explicit audit action.
   * Overrides the default action inferred from the transport.
   */
  action?: AuditAction;

  /**
   * Resource affected by the operation.
   */
  resource?: AuditResource;

  /**
   * Before and after state of the resource.
   */
  state?: AuditState;

  /**
   * Additional business metadata.
   */
  metadata?: Record<string, unknown>;
}
