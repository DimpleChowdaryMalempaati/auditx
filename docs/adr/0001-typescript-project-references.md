# ADR-0001: Use TypeScript Project References

## Decision

- Use npm workspaces.
- Use TypeScript project references.
- Every package is a composite project.
- Packages reference dependencies instead of importing source via path aliases.

## Reason

- Faster incremental builds.
- Better editor support.
- Scalable architecture.
- Clean dependency graph.
