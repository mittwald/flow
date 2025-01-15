"use client";
import { usePromise } from "@mittwald/react-use-promise";
import { getServerData } from "~/app/remote/actions";

export const ServerData = () => {
  const serverData = usePromise(getServerData, [], {});
  return serverData;
};
