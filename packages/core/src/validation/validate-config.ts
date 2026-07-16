import type { AuditConfig } from "../interfaces/audit-config";

import { AuditConfigurationError } from "../errors/AuditConfigurationError";

export function validateConfig(config: AuditConfig): void {
  if (!config.application) {
    throw new AuditConfigurationError(
      "AuditX configuration must include an application object.",
    );
  }

  if (!config.application.name?.trim()) {
    throw new AuditConfigurationError("Application name is required.");
  }

  if (!config.adapters?.length) {
    throw new AuditConfigurationError(
      "At least one audit adapter must be configured.",
    );
  }

  for (const adapter of config.adapters) {
    if (typeof adapter.persist !== "function") {
      throw new AuditConfigurationError(
        "Every audit adapter must implement the persist() method.",
      );
    }
  }
}
