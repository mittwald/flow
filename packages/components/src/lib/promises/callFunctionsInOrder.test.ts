import { beforeEach, expect, test } from "vitest";
import { callFunctionsInOrder } from "@/lib/promises/callFunctionsInOrder";

let history: string[];

beforeEach(() => {
  history = [];
});

const asyncFn = () =>
  new Promise((res) => {
    history.push("startAsync");
    setTimeout(() => {
      history.push("endAsync");
      res("asyncAction");
    }, 10);
  });

const asyncFailingFn = () =>
  new Promise((ignored, rej) => {
    history.push("startAsync");
    setTimeout(() => {
      history.push("failAsync");
      rej(new Error("failAsync"));
    }, 10);
  });

const syncFn = () => {
  history.push("sync");
  return "sync";
};

const failSyncFn = () => {
  history.push("failSync");
  throw new Error("failSync");
};

test.each([
  [[], ""],
  [[syncFn], "sync"],
  [[asyncFn], "startAsync,endAsync"],
  [[syncFn, asyncFn], "sync,startAsync,endAsync"],
  [[asyncFn, syncFn], "startAsync,endAsync,sync"],
  [[asyncFn, asyncFn], "startAsync,endAsync,startAsync,endAsync"],
  [[syncFn, syncFn], "sync,sync"],
  [
    [asyncFn, asyncFn, asyncFn, syncFn],
    "startAsync,endAsync,startAsync,endAsync,startAsync,endAsync,sync",
  ],
  [[asyncFailingFn, syncFn], "startAsync,failAsync"],
  [[syncFn, asyncFailingFn], "sync,startAsync,failAsync"],
  [[failSyncFn, asyncFailingFn], "failSync"],
])("functions are correctly called", async (fnArray, expectation) => {
  try {
    await callFunctionsInOrder(fnArray)();
  } catch (error) {
    // ok
  }
  expect(history.join()).toBe(expectation);
});
