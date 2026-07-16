import { AuditEngine } from "../engine/AuditEngine";
import { AuditEventMapper } from "../engine/AuditEventMapper";
import { ConsoleLogger } from "../logger/ConsoleLogger";
import type { AuditConfig } from "../interfaces/audit-config";
import type { Logger } from "../interfaces/logger";
import { validateConfig } from "../validation/validate-config";

export class AuditRuntime {
  readonly engine: AuditEngine;

  readonly mapper: AuditEventMapper;

  readonly logger: Logger;

  private constructor(
    engine: AuditEngine,
    mapper: AuditEventMapper,
    logger: Logger,
  ) {
    this.engine = engine;
    this.mapper = mapper;
    this.logger = logger;
  }

  static create(config: AuditConfig): AuditRuntime {
    validateConfig(config);

    const logger = config.logger ?? new ConsoleLogger();

    const engine = new AuditEngine(config);

    const mapper = new AuditEventMapper();

    return new AuditRuntime(engine, mapper, logger);
  }
}
