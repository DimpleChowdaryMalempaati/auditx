# Changelog

All notable changes to AuditX will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [0.1.0] - Unreleased

### Added

- Monorepo workspace structure
- TypeScript-first package architecture
- `@auditx/contracts`
- `@auditx/core`
- `@auditx/express`
- `@auditx/postgres`
- Express middleware for automatic audit logging
- PostgreSQL adapter
- Request-scoped audit builder
- Actor resolution support
- Audit event enrichment
- Example Express application
- Docker development environment
- Unit test suite
- Coverage reporting

### Changed

- Improved middleware option normalization
- Enhanced audit context enrichment
- Added application metadata enrichment

### Fixed

- Audit middleware request lifecycle handling
- PostgreSQL persistence initialization
- Route filtering behavior

## Upcoming

### Planned for v0.2

- Fastify integration
- NestJS integration
- MongoDB adapter
- MySQL adapter
- OpenTelemetry integration
- Elasticsearch adapter
