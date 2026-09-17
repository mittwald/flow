import type { IconName } from "@/icons/iconNames";
import {
  computed,
  defineComponent,
  inject,
  provide,
  type Component,
  type ComputedRef,
  type InjectionKey,
  type PropType,
  type Ref,
} from "vue";

/**
 * Icons to render instead of Flow's own.
 *
 * Each entry is a component rendering an `<svg>` — Flow's `Icon` still supplies
 * the sizing, the colour and the ARIA around it, exactly as for a built-in
 * icon.
 *
 * Partial, unlike React's `IconSet`, which is `typeof defaultIconSet` and so
 * demands all 132. That works there because `@mittwald/flow-icons-pro` is a
 * complete second set to hand it; there is no Vue build of it, so a set here is
 * something an app assembles, and an icon it leaves out keeps Flow's.
 */
export type IconSet = Partial<Record<IconName, Component>>;

const iconSetKey: InjectionKey<Ref<IconSet | undefined>> =
  Symbol("flowIconSet");

/** The replacement for one icon, if a surrounding set has one. */
export const injectContextIcon = (
  name: IconName,
): ComputedRef<Component | undefined> => {
  const set = inject(iconSetKey, undefined);
  return computed(() => set?.value?.[name]);
};

/**
 * Swaps Flow's icons for another set, below this component.
 *
 * Unlike the rest of this package, it has no counterpart in
 * `@mittwald/flow-remote-react-components`: React's `IconSetProvider` is
 * exported from `@mittwald/flow-react-components` and not from the remote
 * surface. It earns its place here because there is no Vue build of the pro set
 * — an app that licenses FontAwesome Pro, or wants its own icons, has this and
 * nothing else.
 */
export const IconSetProvider = defineComponent({
  name: "IconSetProvider",

  props: {
    /** The icons to use instead. Omitting one keeps Flow's. */
    set: { type: Object as PropType<IconSet>, default: undefined },
  },

  setup(props, { slots }) {
    /*
     * A computed rather than the prop itself: `provide` runs once, and a set
     * that is swapped later would otherwise never reach the icons below.
     */
    provide(
      iconSetKey,
      computed(() => props.set),
    );

    return () => slots.default?.();
  },
});

export default IconSetProvider;
