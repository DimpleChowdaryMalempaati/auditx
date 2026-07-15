import type { AuditMiddlewareOptions } from "../types/audit-middleware-options";

export function normalizeOptions(
  options: AuditMiddlewareOptions,
): AuditMiddlewareOptions {
  return {
    ...options,
    methods: options.methods?.map((method) => method.toUpperCase()),
  };
}
