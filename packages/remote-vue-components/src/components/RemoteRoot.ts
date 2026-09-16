import { DeprecationWarningProvider } from "@/components/DeprecationWarningProvider";
import { provideRemoteContext } from "@/composables/remoteContext";
import { useWatchPathname } from "@/composables/useWatchPathname";
import { stringifyError } from "@/lib/stringifyError";
import { packageVersion } from "@/version";
import {
  connectHostRenderRootRef,
  connectRemoteReceiver,
  type RemoteReceiver,
  type RemoteToHostConnection,
} from "@mittwald/flow-remote-core";
import { initExtBridge } from "@mittwald/ext-bridge/browser";
import {
  defineComponent,
  h,
  onErrorCaptured,
  onMounted,
  ref,
  watch,
  type PropType,
  type StyleValue,
} from "vue";

/**
 * Hides the remote tree without unmounting it: the elements have to exist and
 * mutate, because those mutations are the protocol — the host renders the
 * visible output.
 */
const hiddenStyle: StyleValue = {
  visibility: "hidden",
  height: 0,
  width: 0,
  border: "none",
  position: "absolute",
  marginLeft: "-9999px",
};

/**
 * Connects a Vue app to the mStudio host and renders its children into the
 * remote tree.
 *
 * Everything below it renders `flr-*` elements, never visible DOM — see
 * `docs/remote-ui.md`.
 */
export const RemoteRoot = defineComponent({
  name: "RemoteRoot",

  props: {
    /** Forwarded to the host, which shows its own loading state. */
    isLoading: { type: Boolean, default: undefined },
    /**
     * Internal use only: renders against a receiver in the same realm instead
     * of connecting to a parent frame.
     */
    __remoteReceiver: {
      type: Object as PropType<RemoteReceiver>,
      default: undefined,
    },
  },

  emits: {
    hostPathnameChanged: (pathname: string) => typeof pathname === "string",
  },

  setup(props, { slots, emit }) {
    const rootRef = ref<HTMLDivElement>();
    const connection = ref<RemoteToHostConnection>();
    const language = ref<string>();
    const isConnected = ref(false);
    const failure = ref<unknown>();

    const reportedComponents = new Set<string>();

    provideRemoteContext({
      connection,
      language,
      reportComponentUsage: (component) => {
        if (reportedComponents.has(component)) {
          return;
        }
        reportedComponents.add(component);

        void connection.value?.imports
          .reportEvent?.({ event: "ComponentRendered", data: { component } })
          ?.catch(() => {
            // ignore: host does not support event reporting
          });
      },
    });

    const setIsLoading = () => {
      if (props.isLoading !== undefined) {
        connection.value?.imports.setIsLoading(props.isLoading);
      }
    };

    watch(() => props.isLoading, setIsLoading);

    useWatchPathname((pathname) =>
      connection.value?.imports.setNavigationState({
        pathname,
        isPending: false,
      }),
    );

    /*
     * A render error in the extension is not the host's error to guess at: the
     * host shows its own failure state and the message travels with it. Vue
     * stops propagation when the hook returns `false`, which is what keeps the
     * error from reaching the app's global handler twice.
     */
    onErrorCaptured((error) => {
      connection.value?.imports.setError(stringifyError(error));
      return false;
    });

    onMounted(() => {
      const root = rootRef.value;
      if (!root) {
        return;
      }

      if (props.__remoteReceiver) {
        void connectRemoteReceiver(root, props.__remoteReceiver.connection);
        isConnected.value = true;
        return;
      }

      initExtBridge();

      void connectHostRenderRootRef({
        onPathnameChanged: (pathname) => emit("hostPathnameChanged", pathname),
        onHostError: (error) => {
          failure.value = new Error(error);
        },
        packageVersion,
      })(root)
        ?.then(async (hostConnection) => {
          connection.value = hostConnection;
          setIsLoading();
          const hostConfig = await hostConnection.imports.getHostConfig();
          language.value = hostConfig.language?.trim() || undefined;
          isConnected.value = true;
        })
        .catch((error: unknown) => {
          failure.value = error;
        });
    });

    return () => {
      if (failure.value) {
        throw failure.value;
      }

      /*
       * The host is told about deprecated paths an extension still uses, the
       * same way the React root reports them — that report is how mStudio
       * learns who to inform before something is removed.
       */
      const children = isConnected.value
        ? h(
            DeprecationWarningProvider,
            {
              onWarning: (message: string) => {
                void connection.value?.imports
                  .reportDeprecation?.(message)
                  ?.catch(() => {
                    // ignore: host does not support deprecation reporting
                  });
              },
            },
            { default: () => slots.default?.() },
          )
        : undefined;

      return h(
        "div",
        { ref: rootRef, style: props.__remoteReceiver ? hiddenStyle : {} },
        children,
      );
    };
  },
});

export default RemoteRoot;
