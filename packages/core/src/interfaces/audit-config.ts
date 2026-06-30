import type { AuditAdapter } from "@auditx/contracts";

export interface AuditConfig {
  application: {
    name: string;
    version?: string;
    environment?: string;
  };

  adapters: AuditAdapter[];
}