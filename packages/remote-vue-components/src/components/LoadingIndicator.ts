import { useRemoteConnection } from "@/composables/remoteContext";
import { defineComponent, onBeforeUnmount, watch } from "vue";
import { composition } from "@/lib/composition";

/**
 * Tells the host the extension is still loading, so mStudio shows its own
 * loading state instead of an empty page.
 *
 * The React package calls this `LoadingFallbackTrigger` and re-exports it as
 * `LoadingIndicator` from `@mittwald/mstudio-ext-react-components`.
 */
export const LoadingIndicator = defineComponent({
  name: "LoadingIndicator",

  props: {
    show: { type: Boolean, default: true },
  },

  setup(props) {
    const connection = useRemoteConnection();

    watch(
      [connection, () => props.show],
      ([currentConnection, show]) =>
        currentConnection?.imports.setIsLoading(show),
      { immediate: true },
    );

    /*
     * Taken back on unmount: the host has no way of telling a finished load
     * from an extension that navigated away, so an indicator that disappears
     * without saying so leaves mStudio loading forever.
     */
    onBeforeUnmount(() => connection.value?.imports.setIsLoading(false));

    return () => undefined;
  },
});

/**
 * The name the React package publishes it under. Exported as well so a port
 * does not have to rename an import that means the same thing.
 */
export const LoadingFallbackTrigger = LoadingIndicator;

composition(LoadingIndicator);

export default LoadingIndicator;
