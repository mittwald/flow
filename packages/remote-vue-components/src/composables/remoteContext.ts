import type { RemoteToHostConnection } from "@mittwald/flow-remote-core";
import { inject, provide, type InjectionKey, type Ref } from "vue";

export interface RemoteContext {
  connection: Ref<RemoteToHostConnection | undefined>;
  /** The backoffice's language, once the host has reported its config. */
  language: Ref<string | undefined>;
  reportComponentUsage: (component: string) => void;
}

export const remoteContextKey: InjectionKey<RemoteContext> =
  Symbol("flowRemoteContext");

export const provideRemoteContext = (context: RemoteContext): void =>
  provide(remoteContextKey, context);

/**
 * The connection to the host, for the imperative half of the bridge (host
 * config, navigation, notifications). `undefined` until the host has answered.
 */
export const useRemoteConnection = (): Ref<
  RemoteToHostConnection | undefined
> => {
  const context = inject(remoteContextKey, undefined);

  if (!context) {
    throw new Error(
      "useRemoteConnection() must be called inside a <RemoteRoot />",
    );
  }

  return context.connection;
};

/**
 * The language the host renders in.
 *
 * Flow's React `useLanguage()` reads react-aria's locale, which a local
 * `IntlProvider` sets. A Vue app renders nothing locally, so the only locale
 * that exists is the host's — which is why this package has no `IntlProvider`.
 */
export const useLanguage = (): Ref<string | undefined> => {
  const context = inject(remoteContextKey, undefined);

  if (!context) {
    throw new Error("useLanguage() must be called inside a <RemoteRoot />");
  }

  return context.language;
};
