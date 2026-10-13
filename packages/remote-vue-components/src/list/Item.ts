import { ItemsGridListItem } from "@/auto-generated";
import { watchMobxValue } from "@/lib/mobxSelector";
import { computed, defineComponent, h, ref, useId, type PropType } from "vue";
import { provideItemAccordion } from "./itemContext";
import { injectListModel } from "./listContext";
import { composition } from "@/lib/composition";

/**
 * One item of the list.
 *
 * A component rather than a few lines in `Items`, because an expandable item
 * holds state: each one is open or closed on its own, and a render function has
 * nowhere to keep that.
 */
export const ListItemRow = defineComponent({
  name: "ListItemRow",

  props: {
    itemId: { type: String, required: true },
    data: { type: null as unknown as PropType<never>, required: true },
    isTile: { type: Boolean, default: false },
  },

  setup(props) {
    const list = injectListModel();
    const contentId = useId();
    const renderShape = watchMobxValue(() => list.renderShape);

    const isExpanded = ref(
      renderShape.value.itemView?.defaultExpanded?.(props.data) ?? false,
    );

    const toggle = () => {
      isExpanded.value = !isExpanded.value;
      renderShape.value.onAction?.(props.data);
    };

    provideItemAccordion({
      isActive: computed(() => !!renderShape.value.accordion),
      isExpanded,
      contentId,
      toggle,
    });

    return () => {
      const { itemView, onAction, accordion } = renderShape.value;

      return h(
        ItemsGridListItem,
        {
          id: props.itemId,
          textValue: itemView?.textValue?.(props.data),
          href: itemView?.href?.(props.data),
          target: itemView?.target,
          /* In accordion mode every item acts — the action is the toggle. */
          hasAction: !!accordion || !!onAction || !!itemView?.href,
          isTile: props.isTile,
          /* In accordion mode the item's action is the toggle, as in Flow. */
          onAction: accordion
            ? toggle
            : onAction
              ? () => onAction(props.data)
              : undefined,
        },
        () => itemView?.render?.(props.data),
      );
    };
  },
});

composition(ListItemRow);

export default ListItemRow;
