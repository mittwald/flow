import { Button } from "@/components/Button";
import React from "react";
import { action } from "@storybook/addon-actions";

const sleep = () => new Promise((res) => window.setTimeout(res, 700));

export const syncfunction = action("sync");

const asyncStartAction = action("asyncStart");
const asyncEndAction = action("asyncEnd");

export const asyncFunction = async (...args: unknown[]) => {
  asyncStartAction(...args);
  await sleep();
  asyncEndAction();
};

export const button = <Button variant="accent">Create customer</Button>;
