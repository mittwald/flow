import type { RemoteToHostConnection } from "@mittwald/flow-remote-core";
import { getContext, setContext } from "svelte";

/**
 * What `RemoteRoot` shares with everything below it: the connection to the
 * host, the language the host renders in, and the usage report.
 */
export class RemoteContext {
  public connection = $state<RemoteToHostConnection | undefined>(undefined);
  public language = $state<string | undefined>(undefined);

  readonly #reportedComponents = new Set<string>();

  /**
   * Reports that a component was rendered, so the host can tell which parts of
   * Flow an extension actually uses. Once per component name — the host counts
   * usage, not renders.
   */
  public reportComponentUsage = (component: string): void => {
    if (this.#reportedComponents.has(component)) {
      return;
    }
    this.#reportedComponents.add(component);

    void this.connection?.imports
      .reportEvent?.({ event: "ComponentRendered", data: { component } })
      ?.catch(() => {
        // ignore: host does not support event reporting
      });
  };
}

const remoteContextKey = Symbol.for("flow.remote.svelte.remoteContext");

export const setRemoteContext = (context: RemoteContext): void => {
  setContext(remoteContextKey, context);
};

export const getRemoteContext = (): RemoteContext | undefined =>
  getContext<RemoteContext | undefined>(remoteContextKey);

const requireRemoteContext = (caller: string): RemoteContext => {
  const context = getRemoteContext();

  if (!context) {
    throw new Error(`${caller} must be called inside a <RemoteRoot />`);
  }

  return context;
};

/** A reactive box, the shape Svelte 5 passes state across a module boundary. */
export interface ReactiveValue<T> {
  readonly current: T;
}

/**
 * The connection to the host, for the imperative half of the bridge (host
 * config, navigation, loading state). `current` is `undefined` until the host
 * has answered.
 */
export const useRemoteConnection = (): ReactiveValue<
  RemoteToHostConnection | undefined
> => {
  const context = requireRemoteContext("useRemoteConnection()");

  return {
    get current() {
      return context.connection;
    },
  };
};

/**
 * The language the host renders in.
 *
 * Flow's React `useLanguage()` reads react-aria's locale, which a local
 * `IntlProvider` sets. A Svelte app renders nothing locally, so the only locale
 * that exists is the host's — which is why this package has no `IntlProvider`.
 */
export const useLanguage = (): ReactiveValue<string | undefined> => {
  const context = requireRemoteContext("useLanguage()");

  return {
    get current() {
      return context.language;
    },
  };
};

/**
 * Reports a component as used, if there is a root to report to. Silent outside
 * one, so a component rendered in a test does not need the whole bridge.
 */
export const useComponentUsage = (component: string): (() => void) => {
  const context = getRemoteContext();
  return () => context?.reportComponentUsage(component);
};
