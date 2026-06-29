import { AuditActor } from "./audit-actor";
import { AuditRequest } from "./audit-request";
import { AuditResource } from "./audit-resource";
import { AuditState } from "./audit-state";
import { AuditAction } from "../enums/audit-action";
import { AuditStatus } from "../enums/audit-status";

export interface AuditEvent {
  id: string;

  timestamp: Date;

  action: AuditAction;

  resource: AuditResource;

  actor?: AuditActor;

  request?: AuditRequest;

  state?: AuditState;

  metadata?: Record<string, unknown>;

  status: AuditStatus;
}