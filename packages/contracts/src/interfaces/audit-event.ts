import { AuditAction } from "../enums/audit-action";
import { AuditStatus } from "../enums/audit-status";
import { AuditActor } from "./audit-actor";
import { AuditRequest } from "./audit-request";
import { AuditResource } from "./audit-resource";
import { AuditState } from "./audit-state";

export interface AuditEvent {
  /**
   * Unique audit event identifier.
   * Optional because the persistence layer (e.g. PostgreSQL)
   * may generate it automatically.
   */
  id?: string;

  /**
   * Time at which the audited action occurred.
   */
  timestamp: Date;

  /**
   * Action performed.
   */
  action: AuditAction;

  /**
   * Resource affected by the action.
   */
  resource: AuditResource;

  /**
   * User or system that performed the action.
   */
  actor?: AuditActor;

  /**
   * Request information (HTTP, GraphQL, etc.).
   */
  request?: AuditRequest;

  /**
   * Before and after state of the resource.
   */
  state?: AuditState;

  /**
   * Additional application-specific metadata.
   */
  metadata?: Record<string, unknown>;

  /**
   * Final outcome of the action.
   */
  status: AuditStatus;
}