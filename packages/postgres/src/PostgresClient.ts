import { Pool, type PoolConfig } from "pg";

import type { AuditEvent } from "@auditx/contracts";

import { createTableQuery } from "./queries/create-table";
import { insertAuditQuery } from "./queries/insert-audit";
import type { PostgresConfig } from "./types/postgres-config";

export class PostgresClient {
  private readonly pool: Pool;

  private initialized = false;

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

  private get schema(): string {
    return this.config.schema ?? "public";
  }

  private get table(): string {
    return this.config.table ?? "audit_logs";
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    const client = await this.pool.connect();

    try {
      await client.query(
        createTableQuery(this.schema, this.table)
      );

      this.initialized = true;
    } finally {
      client.release();
    }
  }

  async insert(event: AuditEvent): Promise<void> {
    await this.initialize();

    const client = await this.pool.connect();

    try {
      const query = insertAuditQuery(
        this.schema,
        this.table,
        event
      );

      await client.query(query.text, query.values);
    } finally {
      client.release();
    }
  }
}