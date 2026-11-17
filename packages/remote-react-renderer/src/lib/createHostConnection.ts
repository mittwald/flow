import type { RemoteConnection } from "@mittwald/flow-remote-core";
import type { RemoteReceiver } from "@mittwald/remote-dom-react/host";

export const createHostConnection = (
  receiver: RemoteReceiver,
): RemoteConnection => ({
  mutate: (records) => receiver.connection.mutate(records),
  call: (id, method) => {
    throw new Error(
      `Remote elements rendered by the host do not support method calls (${method}() on node ${id})`,
    );
  },
});
