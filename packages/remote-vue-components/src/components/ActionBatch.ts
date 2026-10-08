import { Action } from "@/components/Action";
import { defineComponent, h, onMounted } from "vue";
import { composition } from "@/lib/composition";
import { useComponentUsage } from "@/composables/useComponentUsage";

/**
 * Groups actions so they report their state together.
 *
 * Flow's version wraps its children in an `Action` without an action of its
 * own, and so does this one — the grouping is the point.
 */
export const ActionBatch = defineComponent({
  name: "ActionBatch",
  setup: (_props, { slots }) => {
    /*
     * Flow's React `ActionBatch` is a plain component rendering `Action`
     * outside a view, so what React reports is that `Action`.
     */
    onMounted(useComponentUsage("Action"));

    return () => h(Action, null, () => slots.default?.());
  },
});

composition(ActionBatch);

export default ActionBatch;
