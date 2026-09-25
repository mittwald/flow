import { Action } from "@/components/Action";
import { defineComponent, h } from "vue";
import { composition } from "@/lib/composition";

/**
 * Groups actions so they report their state together.
 *
 * Flow's version wraps its children in an `Action` without an action of its
 * own, and so does this one — the grouping is the point.
 */
export const ActionBatch = defineComponent({
  name: "ActionBatch",
  setup:
    (_props, { slots }) =>
    () =>
      h(Action, null, () => slots.default?.()),
});

composition(ActionBatch);

export default ActionBatch;
