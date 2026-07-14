import { describe, expect, it } from "vitest";

import { AuditAction } from "@auditx/contracts";

import { RequestAuditBuilder } from "../audit/RequestAuditBuilder";

describe("RequestAuditBuilder", () => {
  it("builds an empty audit context by default", () => {
    const builder = new RequestAuditBuilder();

    expect(builder.build()).toEqual({});
  });

  it("stores an explicit action", () => {
    const builder = new RequestAuditBuilder();

    builder.action(AuditAction.LOGIN);

    expect(builder.build()).toEqual({
      action: AuditAction.LOGIN,
    });
  });

  it("stores a resource", () => {
    const builder = new RequestAuditBuilder();

    builder.resource({
      type: "User",
      id: "123",
    });

    expect(builder.build()).toEqual({
      resource: {
        type: "User",
        id: "123",
      },
    });
  });

  it("stores before and after state", () => {
    const builder = new RequestAuditBuilder();

    builder.state({
      before: {
        name: "John",
      },
      after: {
        name: "Jane",
      },
    });

    expect(builder.build()).toEqual({
      state: {
        before: {
          name: "John",
        },
        after: {
          name: "Jane",
        },
      },
    });
  });

  it("merges metadata", () => {
    const builder = new RequestAuditBuilder();

    builder.metadata({
      module: "Users",
    });

    builder.metadata({
      reason: "Profile updated",
    });

    expect(builder.build()).toEqual({
      metadata: {
        module: "Users",
        reason: "Profile updated",
      },
    });
  });

  it("supports fluent chaining", () => {
    const builder = new RequestAuditBuilder();

    builder
      .action(AuditAction.UPDATE)
      .resource({
        type: "User",
        id: "1",
      })
      .metadata({
        module: "Users",
      });

    expect(builder.build()).toEqual({
      action: AuditAction.UPDATE,
      resource: {
        type: "User",
        id: "1",
      },
      metadata: {
        module: "Users",
      },
    });
  });

  it("returns a copy when build() is called", () => {
    const builder = new RequestAuditBuilder();

    const context = builder.build();

    context.metadata = {
      hacked: true,
    };

    expect(builder.build()).toEqual({});
  });
});
