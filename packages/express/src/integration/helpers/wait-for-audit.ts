import type { Pool } from "pg";

export async function waitForAudit(pool: Pool, timeout = 1000): Promise<void> {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    const result = await pool.query(
      "SELECT COUNT(*)::int AS count FROM public.audit_logs",
    );

    if (result.rows[0].count > 0) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 20));
  }

  throw new Error("Timed out waiting for audit log.");
}
