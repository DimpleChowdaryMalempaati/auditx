import type { Pool } from "pg";

export async function truncateAuditTable(pool: Pool): Promise<void> {
  await pool.query("TRUNCATE TABLE public.audit_logs RESTART IDENTITY;");
}
