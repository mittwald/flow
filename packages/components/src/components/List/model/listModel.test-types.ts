import type { List } from "@/components/List/model/List";
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
