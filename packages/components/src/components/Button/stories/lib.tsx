import { Button } from "@/components/Button";
import React from "react";
import { action } from "storybook/actions";

const sleep = () => new Promise((res) => window.setTimeout(res, 700));

export const syncFunction = action("sync");

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

export const button = <Button color="accent">Create customer</Button>;
