import type {
  CoachMark,
  ComboBox,
  ContextMenu,
  RangeCalendar,
  TableColumn,
  TextField,
} from "@/index";
import { expectTypeOf } from "vitest";

/*
 * `v-model` keys follow the runtime rule in `src/lib/vModel.ts`: a `default*`
 * or `isDefault*` sibling, and the event reporting the prop. A key the types
 * allow is one the wrapper binds.
 */
type PropsOf<Component> = Component extends new () => { $props: infer Props }
  ? Props
  : never;

type CoachMarkProps = PropsOf<typeof CoachMark>;
type ComboBoxProps = PropsOf<typeof ComboBox>;
type RangeCalendarProps = PropsOf<typeof RangeCalendar>;
type TableColumnProps = PropsOf<typeof TableColumn>;

expectTypeOf<CoachMarkProps>().toHaveProperty("onUpdate:isOpen");
expectTypeOf<PropsOf<typeof ContextMenu>>().toHaveProperty("onUpdate:isOpen");
expectTypeOf<RangeCalendarProps>().toHaveProperty("onUpdate:focusedValue");
expectTypeOf<ComboBoxProps>().toHaveProperty("onUpdate:inputValue");
expectTypeOf<ComboBoxProps>().toHaveProperty("onUpdate:modelValue");
expectTypeOf<PropsOf<typeof TextField>>().toHaveProperty("modelValue");

/* `defaultItems` and `defaultWidth` exist, but no event reports either. */
expectTypeOf<ComboBoxProps>().not.toHaveProperty("onUpdate:items");
expectTypeOf<TableColumnProps>().not.toHaveProperty("onUpdate:width");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testUnreportedPropIsNotBindable() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const props: ComboBoxProps = {
    // @ts-expect-error `items` has no change event
    "onUpdate:items": () => undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function testPropWithoutModelIsNotBindable() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const props: TableColumnProps = {
    // @ts-expect-error `width` has no change event
    "onUpdate:width": () => undefined,
  };
}
