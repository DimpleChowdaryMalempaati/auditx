import type {
  AuditAction,
  AuditContext,
  AuditResource,
  AuditState,
} from "@auditx/contracts";

import type { RequestAuditInternal } from "./RequestAuditInternal";

export class RequestAuditBuilder implements RequestAuditInternal {
  private readonly context: AuditContext = {};

  action(action: AuditAction): this {
    this.context.action = action;
    return this;
  }

  resource(resource: AuditResource): this {
    this.context.resource = resource;
    return this;
  }

  state(state: AuditState): this {
    this.context.state = state;
    return this;
  }

  metadata(metadata: Record<string, unknown>): this {
    this.context.metadata = {
      ...this.context.metadata,
      ...metadata,
    };

    return this;
  }

  build(): AuditContext {
    return {
      ...this.context,
    };
  }
}
