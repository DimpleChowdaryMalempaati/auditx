export interface AuditRequest {
  /**
   * Correlation/request identifier.
   */
  requestId?: string;

  /**
   * HTTP method.
   */
  method?: string;

  /**
   * Request endpoint.
   */
  endpoint?: string;

  /**
   * Client IP address.
   */
  ip?: string;

  /**
   * Client user agent.
   */
  userAgent?: string;
}
