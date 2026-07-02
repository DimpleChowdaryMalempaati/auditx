import {
  AuditAction,
  AuditStatus,
  type AuditEvent,
  type TransportContext,
} from "@auditx/contracts";

export class AuditEventMapper {
  map(context: TransportContext): AuditEvent {
    const auditContext = context.auditContext;

    return {
      timestamp: new Date(),

      action: auditContext?.action ?? this.resolveAction(context),

      actor: context.actor,

      resource: auditContext?.resource ?? {
        type: context.request.endpoint,
      },

      request: {
        requestId: context.request.requestId,
        method: context.request.method,
        endpoint: context.request.endpoint,
        ip: context.request.ip,
        userAgent: context.request.userAgent,
      },

      state: auditContext?.state,

      metadata: auditContext?.metadata,

      status: this.resolveStatus(context.response.statusCode),
    };
  }

  private resolveAction(context: TransportContext): AuditAction {
    switch (context.request.method.toUpperCase()) {
      case "POST":
        return AuditAction.CREATE;

      case "PUT":
      case "PATCH":
        return AuditAction.UPDATE;

      case "DELETE":
        return AuditAction.DELETE;

      case "GET":
      default:
        return AuditAction.READ;
    }
  }

  private resolveStatus(statusCode: number): AuditStatus {
    return statusCode >= 200 && statusCode < 400
      ? AuditStatus.SUCCESS
      : AuditStatus.FAILED;
  }
}
