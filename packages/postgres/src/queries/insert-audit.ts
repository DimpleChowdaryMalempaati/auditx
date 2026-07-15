import type { AuditEvent } from "@auditx/contracts";

import { validateIdentifier } from "../utils/validate-identifier";

export interface InsertAuditQuery {
  text: string;
  values: unknown[];
}

export function insertAuditQuery(
  schema: string,
  table: string,
  event: AuditEvent,
): InsertAuditQuery {
  const safeSchema = validateIdentifier(schema);
  const safeTable = validateIdentifier(table);

  return {
    text: `
      INSERT INTO ${safeSchema}.${safeTable} (
        timestamp,
        action,
        actor,
        resource,
        request,
        before_state,
        after_state,
        metadata,
        status
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9
      );
    `,
    values: [
      event.timestamp,
      event.action,
      event.actor ?? null,
      event.resource,
      event.request ?? null,
      event.state?.before ?? null,
      event.state?.after ?? null,
      event.metadata ?? null,
      event.status,
    ],
  };
}
