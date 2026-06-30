import { Pool, type PoolConfig } from "pg";

import type { AuditEvent } from "@auditx/contracts";

import { createTableQuery } from "./queries/create-table";
import type { PostgresConfig } from "./types/postgres-config";

export class PostgresClient {
  private readonly pool: Pool;

  constructor(
    private readonly config: PostgresConfig
  ) {
    if ("pool" in config) {
      this.pool = config.pool;
    } else {
      const poolConfig: PoolConfig = {
        host: config.connection.host,
        port: config.connection.port,
        database: config.connection.database,
        user: config.connection.user,
        password: config.connection.password,
        ssl: config.connection.ssl,
      };

      this.pool = new Pool(poolConfig);
    }
  }

  async initialize(): Promise<void> {
    const client = await this.pool.connect();

    try {
      const schema = this.config.schema ?? "public";
      const table = this.config.table ?? "audit_logs";

      await client.query(createTableQuery(schema, table));
    } finally {
      client.release();
    }
  }

  async insert(event: AuditEvent): Promise<void> {
    console.log("Persisting audit event", event);

    // TODO: Implement INSERT query
  }
}