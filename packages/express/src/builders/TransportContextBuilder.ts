import type { Request, Response } from "express";

import type {
  AuditActor,
  TransportContext,
} from "@auditx/contracts";

export class TransportContextBuilder {
  build(
    request: Request,
    response: Response,
    duration: number,
    actor?: AuditActor
  ): TransportContext {
    return {
      request: {
        method: request.method,
        endpoint: request.originalUrl,
        ip: request.ip,
        userAgent: request.get("user-agent") ?? undefined,
        requestId: request.get("x-request-id") ?? undefined,
        headers: request.headers,
        query: request.query,
        params: request.params,
        body: request.body,
      },
      response: {
        statusCode: response.statusCode,
        duration,
      },
      actor,
    };
  }
}