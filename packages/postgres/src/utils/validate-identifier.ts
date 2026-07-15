export function validateIdentifier(identifier: string): string {
  const regex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

  if (!regex.test(identifier)) {
    throw new Error(`Invalid PostgreSQL identifier: "${identifier}".`);
  }

  return identifier;
}
