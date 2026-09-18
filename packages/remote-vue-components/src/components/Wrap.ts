import { flattenChildren } from "@/overlays/childProps";
import { defineComponent, type VNode } from "vue";

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

      /*
       * Unwrapping means rendering what the child was given. A slot function is
       * the usual case; an array child is what `h(X, null, [a, b])` produces.
       */
      const children = child.children;
      if (typeof children === "object" && children && "default" in children) {
        return (children.default as () => VNode[])();
      }
      return children as VNode[] | undefined;
    };
  },
});

export default Wrap;
