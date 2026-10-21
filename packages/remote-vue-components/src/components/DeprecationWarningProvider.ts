import {
  defineComponent,
  inject,
  provide,
  type InjectionKey,
  type PropType,
} from "vue";
import { composition } from "@/lib/composition";

export type DeprecationWarningHandler = (message: string) => void;

const deprecationWarningKey: InjectionKey<DeprecationWarningHandler> = Symbol(
  "flowDeprecationWarning",
);

/**
 * Collects the deprecation warnings a remote app triggers.
 *
 * `RemoteRoot` installs one that forwards to the host, which is how mStudio
 * learns which deprecated paths an extension still uses.
 */
export const DeprecationWarningProvider = defineComponent({
  name: "DeprecationWarningProvider",

  props: {
    onWarning: {
      type: Function as PropType<DeprecationWarningHandler>,
      default: undefined,
    },
  },

  setup(props, { slots }) {
    const reported = new Set<string>();

    provide(deprecationWarningKey, (message: string) => {
      const onWarning = props.onWarning;
      if (!onWarning || reported.has(message)) {
        return;
      }
      reported.add(message);
      onWarning(message);
    });

    return () => slots.default?.();
  },
});

/** Messages already written to `console.warn`, across all providers. */
const consoleReported = new Set<string>();

/**
 * Warns once per message, like Flow's hook: in the console once for the whole
 * app, and once to each provider.
 */
export const useWarnDeprecation = (): DeprecationWarningHandler => {
  const onWarning = inject(deprecationWarningKey, undefined);

  return (message: string) => {
    if (!consoleReported.has(message)) {
      consoleReported.add(message);
      console.warn(message);
    }
    onWarning?.(message);
  };
};

composition(DeprecationWarningProvider);

export default DeprecationWarningProvider;
