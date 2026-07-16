import type { AuditAdapter } from "@auditx/contracts";

import type { Logger } from "./logger";

export interface AuditApplication {
  /**
   * Application name.
   */
  name: string;

  /**
   * Application version.
   */
  version?: string;

  /**
   * Runtime environment.
   */
  environment?: string;
}

export interface AuditConfig {
  /**
   * Application information.
   */
  application: AuditApplication;

  /**
   * Audit adapters.
   */
  adapters: AuditAdapter[];

  /**
   * Optional logger implementation.
   * Defaults to ConsoleLogger.
   */
  logger?: Logger;
}
