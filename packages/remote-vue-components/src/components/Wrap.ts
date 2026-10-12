import { defaultSlotOf, flattenChildren } from "@/overlays/childProps";
import { defineComponent } from "vue";
import { composition } from "@/lib/composition";

/**
 * Renders its child when `if` holds, and that child's own children otherwise —
 * a wrapper you can switch off without branching the tree around it.
 */
export const Wrap = defineComponent({
  name: "Wrap",

  props: {
    if: { type: null, required: true },
  },

  setup(props, { slots }) {
    return () => {
      const [child] = flattenChildren(slots.default?.());

      if (props.if || !child) {
        return child;
      }

      /* Unwrapping means rendering what the child was given, in any form. */
      return flattenChildren(defaultSlotOf(child.children)?.());
    };
  },
});

composition(Wrap);

export default Wrap;
