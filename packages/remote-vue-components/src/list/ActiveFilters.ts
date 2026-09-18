import {
  Badge,
  Button,
  Div,
  Text,
  Tooltip,
  TooltipTrigger,
} from "@/auto-generated";
import { IconClose, IconSave, IconUndo } from "@/icons";
import { watchMobxValue } from "@/lib/mobxSelector";
import { ListFilter } from "@mittwald/flow-components-base";
import { defineComponent, h, type VNodeChild } from "vue";
import { injectListModel } from "./listContext";
import { useListTexts, type ListTextKey } from "./locales";
import { listStyles } from "./styles";
import type { ListRendered } from "./types";

/** What the chips need of a filter and its values, and nothing more. */
interface ChipFilter {
  readonly storageKey: string;
  readonly values: {
    readonly id: string;
    readonly isActive: boolean;
    deactivate(): void;
    render(): ListRendered;
  }[];
  getArrayValue(): { id: string }[];
  isStoringAvailable(): boolean;
  hasChanges(): boolean;
}

/**
 * The selected filter values, and what can be done with the set of them.
 *
 * Shown beside the filter menus rather than inside them, so a selection made in
 * one menu stays visible while another is open — and can be taken back one
 * value at a time.
 */
export const ActiveFilters = defineComponent({
  name: "ListActiveFilters",

  props: {
    isDisabled: { type: Boolean, default: false },
  },

  setup(props) {
    const list = injectListModel();
    const texts = useListTexts();

    /* Every read here is of the table's filter state. */
    const tableRevision = watchMobxValue(() => list.listTable.revision);

    const iconButton = (
      label: ListTextKey,
      icon: unknown,
      onPress: () => void,
    ): VNodeChild =>
      h(TooltipTrigger, { isDisabled: props.isDisabled }, () => [
        h(Tooltip, null, () => texts.value(label)),
        h(
          Button,
          {
            size: "s",
            variant: "plain",
            color: "secondary",
            "aria-label": texts.value(label),
            onPress,
          },
          () => h(icon as never),
        ),
      ]);

    return () => {
      void tableRevision.value;

      const filters = list.filters as unknown as ChipFilter[];

      const chips = filters.flatMap((filter) =>
        filter.values
          .filter((value) => value.isActive)
          .map((value) =>
            h(
              Badge,
              {
                key: value.id,
                isDisabled: props.isDisabled,
                onClose: () => value.deactivate(),
              },
              () => h(Text, null, () => value.render()),
            ),
          ),
      );

      const hasChanges = filters.some((filter) => filter.hasChanges());
      const storingAvailable = filters.some((filter) =>
        filter.isStoringAvailable(),
      );

      const storeButton =
        storingAvailable && hasChanges
          ? iconButton("filters.store", IconSave, () =>
              ListFilter.storeFilters(list, filters, {
                autosave: false,
                manualSave: true,
              }),
            )
          : undefined;

      const resetButton = hasChanges
        ? iconButton("filters.reset", IconUndo, () => list.resetFilters())
        : undefined;

      const clearButton =
        chips.length > 1
          ? iconButton("filters.clear", IconClose, () =>
              list.filters.forEach((filter) => filter.clear()),
            )
          : undefined;

      if (chips.length === 0 && !storeButton && !resetButton) {
        return null;
      }

      return h(Div, { class: listStyles.activeFilters }, () => [
        ...chips,
        storeButton,
        resetButton,
        clearButton,
      ]);
    };
  },
});

export default ActiveFilters;
