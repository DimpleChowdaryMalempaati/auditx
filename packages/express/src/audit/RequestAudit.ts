import type {
    AuditAction,
    AuditResource,
    AuditState,
  } from "@auditx/contracts";
  
  export interface RequestAudit {
    /**
     * Overrides the inferred audit action.
     */
    action(action: AuditAction): this;
  
    /**
     * Sets the affected resource.
     */
    resource(resource: AuditResource): this;
  
    /**
     * Sets the before/after state.
     */
    state(state: AuditState): this;
  
    /**
     * Adds business metadata.
     */
    metadata(metadata: Record<string, unknown>): this;
  }