import {
  Version,
  type HostExports,
  type RemoteExports,
  type RemoteToHostConnection,
} from "@/connection/types";
import { RemoteError } from "@/error";
import { FlowThreadSerialization } from "@/serialization/FlowThreadSerialization";
import { type RemoteConnection } from "@mittwald/remote-dom-core/elements";
import { ThreadNestedIframe } from "@quilted/threads";

interface Options {
  root: HTMLDivElement;
  onPathnameChanged?: (pathname: string) => void;
}

const incompatibleParentFrameError = () =>
  new RemoteError("Could not find any compatible parent frame");

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const connectHostRenderRoot = async (
  options: Options,
): Promise<RemoteToHostConnection> => {
  const { root, onPathnameChanged } = options;

  const connectInternal = async () => {
    const connection = new ThreadNestedIframe<HostExports, RemoteExports>({
      serialization: new FlowThreadSerialization(),
      exports: {
        render: (connection: RemoteConnection) =>
          import("@mittwald/remote-dom-core/elements").then(
            ({ RemoteMutationObserver }) => {
              const observer = new RemoteMutationObserver(connection);
              observer.observe(root);
            },
          ),
        setPathname: async (pathname) => {
          onPathnameChanged?.(pathname);
        },
      },
    });

    if (connection.parent === window) {
      throw incompatibleParentFrameError();
    }

    try {
      await connection.imports.setIsReady(Version.v3);

      if (typeof mwExtBridge !== "undefined") {
        mwExtBridge.connection = connection.imports;
        await mwExtBridge.readiness.setIsReady();
      }

      return connection;
    } catch (error) {
      if (
        error instanceof Error &&
        /No '.*' method is exported from this thread/.test(error.message)
      ) {
        throw incompatibleParentFrameError();
      }
      throw error;
    }
  };

  let attempt = 1;

  while (true) {
    try {
      return await connectInternal();
    } catch (error) {
      if (attempt <= 5) {
        console.warn(
          `connectHostRenderRoot: Attempt ${attempt} failed, retrying...`,
          error,
        );
        attempt++;
        await sleep(1_000);
        continue;
      }
      throw error;
    }
  }
};

export const connectHostRenderRootRef =
  (opts: Omit<Options, "root">) => (ref: HTMLDivElement) => {
    if ("__remoteConnection" in ref) {
      return ref["__remoteConnection"] as Promise<RemoteToHostConnection>;
    }

    const connection = connectHostRenderRoot({
      root: ref,
      ...opts,
    });
    Object.assign(ref, { __remoteConnection: connection });
    return connection;
  };
