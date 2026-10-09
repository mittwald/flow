<script lang="ts">
  import {
    connectHostRenderRootRef,
    connectRemoteReceiver,
    type RemoteReceiver,
  } from "@mittwald/flow-remote-core";
  import { initExtBridge } from "@mittwald/ext-bridge/browser";
  import { onMount, type Snippet } from "svelte";
  import { normalizeRemoteWhitespace } from "../lib/normalizeWhitespace.js";
  import { RemoteContext, setRemoteContext } from "../lib/remoteContext.svelte.js";
  import { stringifyError } from "../lib/stringifyError.js";
  import { watchPathname } from "../lib/watchPathname.svelte.js";
  import { packageVersion } from "../version.js";
  import DeprecationWarningProvider from "./DeprecationWarningProvider.svelte";

  /**
   * Connects a Svelte app to the mStudio host and renders its children into the
   * remote tree.
   *
   * Everything below it renders `flr-*` elements, never visible DOM — see
   * `docs/remote-ui.md`.
   */
  interface Props {
    /** Forwarded to the host, which shows its own loading state. */
    isLoading?: boolean;
    /** Called when the host navigates, with the pathname it moved to. */
    onHostPathnameChanged?: (pathname: string) => void;
    /**
     * Internal use only: renders against a receiver in the same realm instead
     * of connecting to a parent frame.
     */
    __remoteReceiver?: RemoteReceiver;
    children?: Snippet;
  }

  const {
    isLoading,
    onHostPathnameChanged,
    __remoteReceiver: remoteReceiver,
    children,
  }: Props = $props();

  const context = new RemoteContext();
  setRemoteContext(context);

  let root = $state<HTMLDivElement>();
  let isConnected = $state(false);
  let failure = $state<unknown>(undefined);

  /**
   * Hides the remote tree without unmounting it: the elements have to exist and
   * mutate, because those mutations are the protocol — the host renders the
   * visible output. Only needed in the same-realm case; a real remote app
   * already lives in a hidden iframe.
   */
  const hiddenStyle =
    "visibility:hidden;height:0;width:0;border:none;position:absolute;margin-left:-9999px";

  $effect(() => {
    if (isLoading !== undefined) {
      context.connection?.imports.setIsLoading(isLoading);
    }
  });

  watchPathname((pathname) =>
    context.connection?.imports.setNavigationState({
      pathname,
      isPending: false,
    }),
  );

  /*
   * Thrown rather than reported: a connection that never came up is the app's
   * problem, not something to render around. The host shows its own failure
   * state for everything after the connection (see the boundary below).
   */
  $effect(() => {
    if (failure) {
      throw failure;
    }
  });

  const forwardDeprecationWarning = (message: string) => {
    void context.connection?.imports
      .reportDeprecation?.(message)
      ?.catch(() => {
        // ignore: host does not support deprecation reporting
      });
  };

  /*
   * A render error in the extension is not the host's error to guess at: the
   * host shows its own failure state and the message travels with it.
   */
  const handleRenderError = (error: unknown) => {
    context.connection?.imports.setError(stringifyError(error));
  };

  onMount(() => {
    const target = root;
    if (!target) {
      return;
    }

    /*
     * Before the connection: the mutation observer that carries the tree to the
     * host must not see a whitespace text node the template only carries by
     * accident. See `normalizeWhitespace.ts`.
     */
    normalizeRemoteWhitespace(target);

    if (remoteReceiver) {
      void connectRemoteReceiver(target, remoteReceiver.connection);
      isConnected = true;
      return;
    }

    initExtBridge();

    void connectHostRenderRootRef({
      onPathnameChanged: (pathname) => onHostPathnameChanged?.(pathname),
      onHostError: (error) => {
        failure = new Error(error);
      },
      packageVersion,
    })(target)
      ?.then(async (connection) => {
        context.connection = connection;
        if (isLoading !== undefined) {
          connection.imports.setIsLoading(isLoading);
        }
        const hostConfig = await connection.imports.getHostConfig();
        context.language = hostConfig.language?.trim() || undefined;
        isConnected = true;
      })
      .catch((error: unknown) => {
        failure = error;
      });
  });
</script>

<div bind:this={root} style={remoteReceiver ? hiddenStyle : undefined}>
  {#if isConnected}
    <svelte:boundary onerror={handleRenderError}>
      <DeprecationWarningProvider onWarning={forwardDeprecationWarning}>
        {@render children?.()}
      </DeprecationWarningProvider>
    </svelte:boundary>
  {/if}
</div>
