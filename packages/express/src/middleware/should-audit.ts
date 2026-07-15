import type { Request } from "express";

import type { AuditMiddlewareOptions } from "../types/audit-middleware-options";

function matchesRoute(path: string, route: string): boolean {
  // "/" should only match "/"
  if (route === "/") {
    return path === "/";
  }

  // Exact match
  if (path === route) {
    return true;
  }

  // Prefix match
  return path.startsWith(`${route}/`);
}

export function shouldAudit(
  request: Request,
  options: AuditMiddlewareOptions,
): boolean {
  const { methods, include, exclude } = options;

  const method = request.method.toUpperCase();
  const path = request.path;

  // Method filter
  if (methods?.length && !methods.includes(method)) {
    return false;
  }

  // Exclude always wins
  if (exclude?.some((route) => matchesRoute(path, route))) {
    return false;
  }

  // If include exists, only include matching routes
  if (include?.length) {
    return include.some((route) => matchesRoute(path, route));
  }

  // Default
  return true;
}
