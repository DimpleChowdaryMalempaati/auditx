import type {
    NextFunction,
    Request,
    RequestHandler,
    Response,
  } from "express";
  
  import { AuditX } from "@auditx/core";
  
  import { RequestAuditBuilder } from "../audit/RequestAuditBuilder";
  import { TransportContextBuilder } from "../builders/TransportContextBuilder";
  import { resolveActor } from "../resolvers/resolve-actor";
  import { shouldAudit } from "./should-audit";
  import type { AuditMiddlewareOptions } from "../types/audit-middleware-options";
  
  export class AuditMiddleware {
    private readonly transportContextBuilder = new TransportContextBuilder();
  
    constructor(
      private readonly audit: AuditX,
      private readonly options: AuditMiddlewareOptions = {}
    ) {}
  
    handler(): RequestHandler {
      return (
        request: Request,
        response: Response,
        next: NextFunction
      ): void => {
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
  
        response.on("finish", async () => {
          try {
            const duration = Date.now() - startTime;
  
            const actor = await resolveActor(request, this.options);
  
            const context = this.transportContextBuilder.build(
              request,
              response,
              duration,
              actor
            );
  
            await this.audit.capture(context);
          } catch (error) {
            /**
             * Audit failures must never break the application.
             */
            console.error(
              "AuditX failed to capture audit event.",
              error
            );
          }
        });
  
        next();
      };
    }
  }