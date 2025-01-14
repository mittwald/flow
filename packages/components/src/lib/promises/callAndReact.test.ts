import { test, expect, vi, beforeEach } from "vitest";
import { callAndReact } from "~/lib/promises/callAndReact";

let history: string[];

const onSync = () => history.push("onSync");
const onAsync = () => history.push("onAsync");
const then = () => history.push("then");
const $finally = () => history.push("finally");
const $catch = () => history.push("catch");

beforeEach(() => {
  history = [];
});

describe("When using sync function", () => {
  test("reactions are called in correct order", () => {
    const syncFn = vi.fn(() => history.push("start"));

    callAndReact(syncFn, {
      onAsync,
      onSync,
      then,
      catch: $catch,
      finally: $finally,
    });

    expect(history.join()).toBe("start,onSync,then,finally");
  });

  test("reactions are called in correct order when function fails", () => {
    const asyncFn = vi.fn(() => {
      history.push("start");
      throw new Error("Error");
    });

    callAndReact(asyncFn, {
      onAsync,
      onSync,
      then,
      catch: $catch,
      finally: $finally,
    });

    expect(history.join()).toBe("start,onSync,catch,finally");
  });
});

describe("When using async function", () => {
  test("reactions are called in correct order", async () => {
    const asyncFn = vi.fn(() => {
      history.push("start");
      return Promise.resolve(true);
    });

    await callAndReact(asyncFn, {
      onAsync,
      onSync,
      then,
      catch: $catch,
      finally: $finally,
    });

    expect(history.join()).toBe("start,onAsync,then,finally");
  });

  test("reactions are called in correct order when function fails", async () => {
    const asyncFn = vi.fn(() => {
      history.push("start");
      return Promise.reject("Error");
    });

    await callAndReact(asyncFn, {
      onAsync,
      onSync,
      then,
      catch: $catch,
      finally: $finally,
    });

    expect(history.join()).toBe("start,onAsync,catch,finally");
  });
});
