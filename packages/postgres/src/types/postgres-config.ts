import type { Pool } from "pg";

export interface ConnectionOptions {
  host: string;
  port: number;
  database: string;

  user: string;
  password: string;

  ssl?: boolean;
}

interface BasePostgresConfig {
  schema?: string;
  table?: string;
}

export interface PoolConfig extends BasePostgresConfig {
  pool: Pool;
}

export interface ConnectionConfig extends BasePostgresConfig {
  connection: ConnectionOptions;
}

export type PostgresConfig = PoolConfig | ConnectionConfig;
