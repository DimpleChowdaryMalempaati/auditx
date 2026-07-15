import { Pool } from "pg";

export function createPool(): Pool {
  return new Pool({
    host: "localhost",
    port: 5460,
    database: "auditx",
    user: "postgres",
    password: "postgres",
  });
}
