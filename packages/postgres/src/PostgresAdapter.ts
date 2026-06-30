import type { AuditAdapter, AuditEvent } from "@auditx/contracts";

import { PostgresClient } from "./PostgresClient";
import type { PostgresConfig } from "./types/postgres-config";

export class PostgresAdapter implements AuditAdapter {
  private readonly client: PostgresClient;

  private initialized = false;

  constructor(config: PostgresConfig) {
    this.client = new PostgresClient(config);
  }

  async persist(event: AuditEvent): Promise<void> {
    if (!this.initialized) {
      await this.client.initialize();
      this.initialized = true;
    }

    await this.client.insert(event);
  }
}