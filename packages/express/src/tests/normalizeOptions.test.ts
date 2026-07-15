import { describe, expect, it } from "vitest";

import { normalizeOptions } from "../utils/normalize-options";

describe("normalizeOptions", () => {
  it("normalizes HTTP methods to uppercase", () => {
    const options = normalizeOptions({
      methods: ["post", "Patch", "DELETE"],
    });

    expect(options.methods).toEqual(["POST", "PATCH", "DELETE"]);
  });

  it("preserves other options", () => {
    const options = normalizeOptions({
      include: ["/users"],
      exclude: ["/health"],
    });

    expect(options).toEqual({
      include: ["/users"],
      exclude: ["/health"],
    });
  });

  it("handles empty options", () => {
    expect(normalizeOptions({})).toEqual({});
  });
});
