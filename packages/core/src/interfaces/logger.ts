export interface Logger {
  error(message: string, error?: unknown): void;

  warn(message: string): void;

  info(message: string): void;

  debug(message: string): void;
}
