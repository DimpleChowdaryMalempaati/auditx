export class AuditConfigurationError extends Error {
  constructor(message: string) {
    super(message);

    this.name = "AuditConfigurationError";

    Object.setPrototypeOf(this, AuditConfigurationError.prototype);
  }
}
