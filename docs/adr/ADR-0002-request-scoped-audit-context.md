# ADR-0002: Request-Scoped Audit Context

## Status

Accepted

---

## Context

AuditX provides automatic audit capture through Express middleware. For most requests, this is sufficient because the framework can infer transport-level information such as:

- HTTP method
- Endpoint
- Response status
- Execution duration
- Authenticated actor

However, transport-level information alone is not enough to produce meaningful business audit events.

For example, during a user update operation, only the application knows:

- Which resource was modified
- The resource identifier
- The previous state
- The new state
- Business-specific metadata
- Whether the action represents UPDATE, LOGIN, IMPORT, EXPORT, or another semantic action

Requiring developers to manually construct an `AuditEvent` inside every controller defeats the goal of automatic auditing and tightly couples business code to AuditX.

---

## Decision

AuditX will expose a request-scoped audit API through the Express integration.

Example:

```ts
req.audit.resource({
  type: "User",
  id: user.id,
});

req.audit.state({
  before,
  after,
});

req.audit.action(AuditAction.UPDATE);

req.audit.metadata({
  module: "Users",
});
```

These methods do not persist audit events directly.

Instead, they enrich an internal request-scoped audit context.

When the HTTP response finishes, the Express middleware merges this context into the `TransportContext` before calling `audit.capture()`.

The Core package remains responsible for transforming the `TransportContext` into an `AuditEvent`.

---

## Rationale

This approach provides several advantages:

- Zero-configuration auditing continues to work for simple applications.
- Business-specific information can be added only where needed.
- Controllers never construct `AuditEvent` objects directly.
- Audit failures remain isolated from application logic.
- Audit semantics remain centralized within the Core package.
- Future transport integrations (Fastify, NestJS, GraphQL, queues) can adopt the same internal model.

This follows the principle:

> Developers provide business facts. AuditX constructs audit events.

---

## Consequences

### Positive

- Excellent developer experience.
- Clear separation between transport concerns and business concerns.
- Framework remains extensible.
- Controllers remain focused on business logic.

### Trade-offs

- Express requests require a request-scoped audit helper.
- Transport integrations must implement the same request-context pattern.

---

## Alternatives Considered

### Manual `audit.log()`

Rejected because every controller would need to manually construct an `AuditEvent`.

### Mutable `req.auditContext`

Rejected because exposing mutable state directly makes the API harder to evolve and validate.

### HTTP-only inference

Rejected because HTTP methods cannot accurately represent business actions such as LOGIN, IMPORT, EXPORT, or custom operations.

---

## Future Work

- Implement `RequestAuditBuilder` in `@auditx/express`.
- Merge request-scoped audit context into `TransportContext`.
- Support action override precedence in the Core mapper.
- Automatically enrich all audit events with application metadata in the `AuditEngine`.
