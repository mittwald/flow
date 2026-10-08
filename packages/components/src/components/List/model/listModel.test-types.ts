import type { List } from "@/components/List/model/List";
import type { ListFilter, ListItem } from "@mittwald/flow-components-base";
import { expectTypeOf } from "vitest";

/*
 * The model reaches consumers through `useList()` and `onChange(list)`. Its
 * rules live in `@mittwald/flow-components-base`, and the back-references to
 * React's `List` are what the shared types cannot know about — so they are
 * asserted here.
 */
type CrewList = List<{ name: string }>;
type AnyFilter = CrewList["filters"][number];
type Value = AnyFilter["values"][number];
type ActiveValue = ReturnType<AnyFilter["getArrayValue"]>[number];
type AnyItem = CrewList["items"]["entries"][number];

expectTypeOf<Value["filter"]["list"]>().toEqualTypeOf<List<unknown>>();
expectTypeOf<Value["filter"]["property"]>().toEqualTypeOf<string>();
expectTypeOf<ActiveValue["filter"]["list"]>().toEqualTypeOf<List<unknown>>();
expectTypeOf<AnyItem["collection"]["list"]>().toEqualTypeOf<CrewList>();

// @ts-expect-error a collection keeps its list's item type
expectTypeOf<AnyItem["collection"]["list"]>().toEqualTypeOf<List<unknown>>();
// @ts-expect-error a filter value's list is not narrowed to the item type
expectTypeOf<Value["filter"]["list"]>().toEqualTypeOf<CrewList>();

/* Without React's subclasses there is no `list` to reach. */
// @ts-expect-error the shared filter has no `list`
expectTypeOf<ListFilter<{ name: string }>>().toHaveProperty("list");
// @ts-expect-error the shared item's collection has no `list`
expectTypeOf<ListItem<{ name: string }>["collection"]>().toHaveProperty("list");
