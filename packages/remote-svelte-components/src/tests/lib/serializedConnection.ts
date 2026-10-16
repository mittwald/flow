import {
  FlowThreadSerialization,
  type RemoteConnection,
  type RemoteReceiver,
} from "@mittwald/flow-remote-core";
import { ThreadMessagePort } from "@quilted/threads";

/*
 * The serializing connection behind the `Remote` test environment.
 *
 * `mutate` and `call` are the whole of `RemoteConnection`, and in production the
 * remote side holds them as thread functions: calling one serializes its
 * arguments with FlowThreadSerialization, posts them, and the host deserializes
 * before applying. A MessageChannel with a ThreadMessagePort on each end
 * reproduces exactly that, minus the iframe — so arguments also have to survive
 * `postMessage`'s structured clone, the same constraint the real connection
 * imposes.
 *
 * Before this existed, `Remote` handed <RemoteRoot /> the receiver's own
 * connection and props arrived as the very objects the test created. That left
 * the serialization half of the remote path — the half production always takes —
 * outside the test suite entirely, which is how #2894 shipped with a green
 * suite.
 */
interface SerializedConnectionExports {
  mutate: (records: readonly unknown[]) => Promise<void>;
  call: (id: string, method: string, ...args: unknown[]) => Promise<unknown>;
}

export const createSerializedConnection = (
  target: RemoteConnection,
): RemoteConnection => {
  const { port1, port2 } = new MessageChannel();

  // The host end: applies what arrives to the receiver's real connection.
  new ThreadMessagePort<Record<string, never>, SerializedConnectionExports>(
    port1,
    {
      serialization: new FlowThreadSerialization(),
      exports: {
        mutate: async (records) =>
          target.mutate(records as Parameters<RemoteConnection["mutate"]>[0]),
        call: async (id, method, ...args) => target.call(id, method, ...args),
      },
    },
  );

  // The remote end: what the mutation observer inside <RemoteRoot /> talks to.
  const remote = new ThreadMessagePort<SerializedConnectionExports>(port2, {
    serialization: new FlowThreadSerialization(),
  });

  port1.start();
  port2.start();

  return {
    /*
     * `RemoteConnection.mutate` is synchronous, and across a thread it cannot
     * be. Production has the same seam — the host applies a batch a tick after
     * the remote sends it — which is why the visual environments gate their
     * screenshot on painted content rather than on `render()` resolving.
     */
    mutate: (records) => void remote.imports.mutate(records),
    call: (id, method, ...args) => remote.imports.call(id, method, ...args),
  };
};

/**
 * A stand-in receiver for <RemoteRoot />, whose connection round-trips through
 * FlowThreadSerialization before reaching `receiver`. <RemoteRenderer /> keeps
 * the real `receiver`; only the remote half is rerouted.
 */
export const createSerializedReceiver = (
  receiver: RemoteReceiver,
): RemoteReceiver =>
  /*
   * <RemoteRoot /> reads nothing but `.connection` off the receiver it is given
   * (see its `RemoteReceiverRoot` branch), so a bare object carries the whole
   * contract this needs. It is not a usable RemoteReceiver beyond that, hence
   * the cast.
   */
  ({
    connection: createSerializedConnection(receiver.connection),
  }) as RemoteReceiver;
