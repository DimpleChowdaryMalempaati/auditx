import type { NextFunction, Request, RequestHandler, Response } from "express";

import { AuditX } from "@auditx/core";

import { RequestAuditBuilder } from "../audit/RequestAuditBuilder";
import { TransportContextBuilder } from "../builders/TransportContextBuilder";
import { resolveActor } from "../resolvers/resolve-actor";
import type { AuditMiddlewareOptions } from "../types/audit-middleware-options";
import { normalizeOptions } from "../utils/normalize-options";
import { shouldAudit } from "./should-audit";

export class AuditMiddleware {
  private readonly transportContextBuilder = new TransportContextBuilder();

  private readonly options: AuditMiddlewareOptions;

  constructor(
    private readonly audit: AuditX,
    options: AuditMiddlewareOptions = {},
  ) {
    this.options = normalizeOptions(options);
  }

  handler(): RequestHandler {
    return (request: Request, response: Response, next: NextFunction): void => {
      /**
       * Every request receives its own request-scoped audit builder.
       * Controllers can safely enrich audit information regardless
       * of whether the request will ultimately be audited.
       */
      request.audit = new RequestAuditBuilder();

      if (!shouldAudit(request, this.options)) {
        return next();
      }

      const startTime = Date.now();

      response.on("finish", () => {
        void this.capture(request, response, startTime);
      });

      next();
    };
  }

  private async capture(
    request: Request,
    response: Response,
    startTime: number,
  ): Promise<void> {
    try {
      const duration = Date.now() - startTime;

      const actor = await resolveActor(request, this.options);

      const context = this.transportContextBuilder.build(
        request,
        response,
        duration,
        actor,
      );

      await this.audit.capture(context);
    } catch (error) {
      /**
       * Audit failures must never break the application.
       */
      console.error("AuditX failed to capture audit event.", error);
    }
  }
}
