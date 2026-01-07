"use client";
import type { FC } from "react";
import { usePromise } from "@mittwald/react-use-promise";

const apiSleep = (): Promise<void> =>
  new Promise((res) => setTimeout(res, 2000));
const getContent = async () => {
  await apiSleep();
  throw new Error("failed");
};

export const AsyncContent: FC = () => usePromise(getContent, []);
