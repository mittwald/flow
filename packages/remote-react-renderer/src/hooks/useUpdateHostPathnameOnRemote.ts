import {
  Version,
  type HostToRemoteConnection,
} from "@mittwald/flow-remote-core";
import { useLayoutEffect } from "react";

/** Updates the host pathname in the remote connection. */
export const useUpdateHostPathnameOnRemote = (
  hostPathname?: string,
  connection?: HostToRemoteConnection,
) => {
  useLayoutEffect(() => {
    if (hostPathname === undefined || !connection) {
      return;
    }

    const { thread, version } = connection;
    if (version >= Version.v2) {
      thread.imports.setPathname(hostPathname);
    }
  }, [hostPathname, connection]);
};
