import { describe, expect, it } from "vitest";

import type { AuditAdapter } from "@auditx/contracts";

import { AuditConfigurationError } from "../errors/AuditConfigurationError";
import type { AuditConfig } from "../interfaces/audit-config";
import { validateConfig } from "../validation/validate-config";

const adapter: AuditAdapter = {
  persist: async () => {},
};

function createConfig(): AuditConfig {
  return {
    application: {
      name: "AuditX",
      version: "1.0.0",
      environment: "test",
    },
    adapters: [adapter],
  };
}

describe("validateConfig", () => {
  it("accepts a valid configuration", () => {
    expect(() => validateConfig(createConfig())).not.toThrow();
  });

  it("throws when application is missing", () => {
    const config = {
      adapters: [adapter],
    } as AuditConfig;

    expect(() => validateConfig(config)).toThrow(AuditConfigurationError);

    expect(() => validateConfig(config)).toThrow(
      "AuditX configuration must include an application object.",
    );
  });

  it("throws when application name is empty", () => {
    const config = createConfig();

    config.application.name = "";

    expect(() => validateConfig(config)).toThrow(AuditConfigurationError);

    expect(() => validateConfig(config)).toThrow(
      "Application name is required.",
    );
  });

  it("throws when no adapters are configured", () => {
    const config = createConfig();

    config.adapters = [];

    expect(() => validateConfig(config)).toThrow(AuditConfigurationError);

    expect(() => validateConfig(config)).toThrow(
      "At least one audit adapter must be configured.",
    );
  });

  it("throws when an adapter does not implement persist()", () => {
    const config = createConfig();

    config.adapters = [{} as AuditAdapter];

    expect(() => validateConfig(config)).toThrow(AuditConfigurationError);

    expect(() => validateConfig(config)).toThrow(
      "Every audit adapter must implement the persist() method.",
    );
  });
});
