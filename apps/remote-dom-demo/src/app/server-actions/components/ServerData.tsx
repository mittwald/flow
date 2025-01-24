"use client";
import { usePromise } from "@mittwald/react-use-promise";
import { getServerData } from "~/app/actions";

export const ServerData = () => {
  const serverData = usePromise(getServerData, [], {});
  return serverData;
};
