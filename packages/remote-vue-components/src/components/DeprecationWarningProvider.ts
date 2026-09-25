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
    provide(deprecationWarningKey, (message: string) =>
      props.onWarning?.(message),
    );

    return () => slots.default?.();
  },
});

/**
 * Warns once per message, in the console and to the provider.
 *
 * Deduplicated per call site, like Flow's hook: a component that warns on every
 * render must not fill the console.
 */
export const useWarnDeprecation = (): DeprecationWarningHandler => {
  const onWarning = inject(deprecationWarningKey, undefined);
  const reported = new Set<string>();

  return (message: string) => {
    if (reported.has(message)) {
      return;
    }
    reported.add(message);
    console.warn(message);
    onWarning?.(message);
  };
};

composition(DeprecationWarningProvider);

export default DeprecationWarningProvider;
