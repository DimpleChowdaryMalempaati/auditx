import type {
    NextFunction,
    Request,
    RequestHandler,
    Response,
  } from "express";
  
  import { AuditX } from "@auditx/core";
  
  import { TransportContextBuilder } from "../builders/TransportContextBuilder";
  import { resolveActor } from "../resolvers/resolve-actor";
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