import { describe, expect, it, vi } from "vitest";
import type { Request } from "express";

import { resolveActor } from "../resolvers/resolve-actor";

describe("resolveActor", () => {
  it("returns undefined when getActor is not configured", async () => {
    const request = {} as Request;

    const actor = await resolveActor(request, {});

    expect(actor).toBeUndefined();
  });

  it("returns the actor from getActor", async () => {
    const request = {
      headers: {},
    } as Request;

    const actor = {
      id: "123",
      email: "john@example.com",
    };

    const getActor = vi.fn().mockResolvedValue(actor);

    await expect(
      resolveActor(request, {
        getActor,
      }),
    ).resolves.toEqual(actor);

    expect(getActor).toHaveBeenCalledTimes(1);
    expect(getActor).toHaveBeenCalledWith(request);
  });

  it("supports synchronous getActor implementations", async () => {
    const request = {} as Request;

    const actor = {
      id: "456",
      email: "jane@example.com",
    };

    const getActor = vi.fn(() => actor);

    await expect(
      resolveActor(request, {
        getActor,
      }),
    ).resolves.toEqual(actor);

    expect(getActor).toHaveBeenCalledOnce();
  });

  it("propagates errors from getActor", async () => {
    const request = {} as Request;

    const error = new Error("Failed to resolve actor");

    const getActor = vi.fn().mockRejectedValue(error);

    await expect(
      resolveActor(request, {
        getActor,
      }),
    ).rejects.toThrow("Failed to resolve actor");

    expect(getActor).toHaveBeenCalledOnce();
  });
});
