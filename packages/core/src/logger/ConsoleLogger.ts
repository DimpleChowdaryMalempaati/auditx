/* eslint-disable no-console */

import type { Logger } from "../interfaces/logger";

export class ConsoleLogger implements Logger {
  error(message: string, error?: unknown): void {
    console.error(message, error);
  }

  warn(message: string): void {
    console.warn(message);
  }

  info(message: string): void {
    console.info(message);
  }

  debug(message: string): void {
    console.debug(message);
  }
}
