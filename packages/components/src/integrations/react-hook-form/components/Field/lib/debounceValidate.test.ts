import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { ValidateResult } from "react-hook-form";
import { debounceValidate } from "./debounceValidate";

describe("debounceValidate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("resolves with ValidateResult after waitMs", async () => {
    interface FormValues {
      email: string;
    }

    const validate = vi.fn<
      (value: string, formValues: FormValues) => ValidateResult
    >((value) => (value.includes("@") ? true : "Invalid email"));

    const debounced = debounceValidate<FormValues, "email">(validate, 500);

    const promise = debounced("test@example.com", {
      email: "test@example.com",
    });

    expect(validate).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(499);
    expect(validate).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    await expect(promise).resolves.toBe(true);

    expect(validate).toHaveBeenCalledTimes(1);
    expect(validate).toHaveBeenCalledWith("test@example.com", {
      email: "test@example.com",
    });
  });

  it("supports async validate functions", async () => {
    interface FormValues {
      username: string;
    }

    const validate = vi.fn<
      (value: string, formValues: FormValues) => Promise<ValidateResult>
    >(async (value) => {
      await Promise.resolve();
      return value.length >= 3 || "Too short";
    });

    const debounced = debounceValidate<FormValues, "username">(validate, 200);

    const promise = debounced("alex", { username: "alex" });

    await vi.advanceTimersByTimeAsync(200);
    await expect(promise).resolves.toBe(true);

    expect(validate).toHaveBeenCalledTimes(1);
    expect(validate).toHaveBeenCalledWith("alex", { username: "alex" });
  });

  it("rejects when validateFunction throws/rejects", async () => {
    interface FormValues {
      code: string;
    }
    const error = new Error("validation failed");

    const validate = vi.fn<
      (value: string, formValues: FormValues) => Promise<ValidateResult>
    >(async () => {
      throw error;
    });

    const debounced = debounceValidate<FormValues, "code">(validate, 100);

    const promise = debounced("abc", { code: "abc" });

    const assertion = promise.catch((e) => {
      expect(e).toBe(error);
    });

    await vi.advanceTimersByTimeAsync(100);
    await assertion;
  });

  it("debounces rapid calls and only executes the latest one", async () => {
    interface FormValues {
      email: string;
    }

    const validate = vi.fn<
      (value: string, formValues: FormValues) => ValidateResult
    >((value) => (value.includes("@") ? true : "Invalid"));

    const debounced = debounceValidate<FormValues, "email">(validate, 300);

    void debounced("first@example.com", {
      email: "first@example.com",
    });

    await vi.advanceTimersByTimeAsync(150);

    const secondPromise = debounced("second@example.com", {
      email: "second@example.com",
    });

    await vi.advanceTimersByTimeAsync(299);
    expect(validate).toHaveBeenCalledTimes(0);

    await vi.advanceTimersByTimeAsync(1);
    await expect(secondPromise).resolves.toBe(true);

    expect(validate).toHaveBeenCalledTimes(1);
    expect(validate).toHaveBeenLastCalledWith("second@example.com", {
      email: "second@example.com",
    });
  });
});
