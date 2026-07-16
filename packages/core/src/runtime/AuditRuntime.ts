import { AuditEngine } from "../engine/AuditEngine";
import { AuditEventMapper } from "../engine/AuditEventMapper";
import type { AuditConfig } from "../interfaces/audit-config";
import type { Logger } from "../interfaces/logger";
import { ConsoleLogger } from "../logger/ConsoleLogger";
import { AuditPipeline } from "../pipeline/AuditPipeline";
import { validateConfig } from "../validation/validate-config";

export class AuditRuntime {
  readonly pipeline: AuditPipeline;

  readonly mapper: AuditEventMapper;

  readonly logger: Logger;

  private constructor(
    pipeline: AuditPipeline,
    mapper: AuditEventMapper,
    logger: Logger,
  ) {
    this.pipeline = pipeline;
    this.mapper = mapper;
    this.logger = logger;
  }

  static create(config: AuditConfig): AuditRuntime {
    validateConfig(config);

    const logger = config.logger ?? new ConsoleLogger();

    const engine = new AuditEngine(config);

    const pipeline = new AuditPipeline(engine);

    const mapper = new AuditEventMapper();

    return new AuditRuntime(pipeline, mapper, logger);
  }
}
