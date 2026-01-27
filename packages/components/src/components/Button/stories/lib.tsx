import { Button } from "@/components/Button";
import { action } from "storybook/actions";

const sleep = () => new Promise((res) => window.setTimeout(res, 700));

export const syncFunction = action("sync");
export const syncFunctionWithError = () => {
  action("sync");
  throw new Error("Something went wrong!");
};

const asyncStartAction = action("asyncStart");
const asyncEndAction = action("asyncEnd");

export const asyncFunction = async (...args: unknown[]) => {
  asyncStartAction(...args);
  await sleep();
  asyncEndAction();
};

export const asyncLongFunction = async (...args: unknown[]) => {
  asyncStartAction(...args);
  await sleep();
  await sleep();
  await sleep();
  asyncEndAction();
};

export const asyncLongFunctionWithError = async (...args: unknown[]) => {
  await asyncLongFunction(...args);
  throw new Error("Something went wrong!");
};

export const asyncFunctionWithError = async (...args: unknown[]) => {
  await asyncFunction(...args);
  throw new Error("Something went wrong!");
};

export const button = <Button color="accent">Create customer</Button>;
