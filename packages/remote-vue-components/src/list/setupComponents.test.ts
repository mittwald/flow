import {
  findSetup,
  findSetups,
  ListFilter,
  ListItem,
  ListLoaderAsync,
  ListSearch,
  ListTableColumn,
} from "@/list/setupComponents";
import { describe, expect, test } from "vitest";
import { Fragment, h } from "vue";

const Wrapper = { name: "Wrapper", render: () => null };

describe("findSetups", () => {
  test("sees through the fragments a v-for produces", () => {
    const children = [
      h(Fragment, [h(ListFilter, { property: "rank" })]),
      h(ListFilter, { property: "name" }),
    ];

    expect(
      findSetups(children, ListFilter).map((f) => f.props.property),
    ).toEqual(["rank", "name"]);
  });

  /*
   * The boundary, and the reason `<List>` throws when a `ListTable` has no
   * columns: a setup element inside another component's slot belongs to that
   * component. Walking in would mean calling a slot outside a render, which
   * Vue warns about and which drops the slot's dependencies.
   */
  test("stops at a component, so a nested column is not the list's", () => {
    const children = [
      h(Wrapper, null, {
        default: () => h(ListTableColumn, null, () => "Name"),
      }),
    ];

    expect(findSetups(children, ListTableColumn)).toHaveLength(0);
  });

  test("hands back the element's scoped slot as a render function", () => {
    const children = [h(ListTableColumn, null, () => "Name")];

    expect(findSetup(children, ListTableColumn)?.render?.({})).toBe("Name");
  });
});

/*
 * Vue camelizes and casts only the props a component declares, and a setup
 * element declares none — so a template's `text-value` and bare
 * `manual-pagination` have to be normalized here.
 */
describe("the props a setup element hands over", () => {
  test("are camelized, except aria-* and data-*", () => {
    const children = [
      h(ListItem, { "text-value": "x", "aria-label": "y", "data-testid": "z" }),
    ];

    expect(findSetup(children, ListItem)?.props).toEqual({
      textValue: "x",
      "aria-label": "y",
      "data-testid": "z",
    });
  });

  test("read a bare boolean attribute as true", () => {
    const children = [
      h(ListLoaderAsync, { "manual-pagination": "", "manual-sorting": false }),
    ];

    expect(findSetup(children, ListLoaderAsync)?.props).toEqual({
      manualPagination: true,
      manualSorting: false,
    });
  });

  test("leave an empty string alone where the prop is not a boolean", () => {
    const children = [h(ListSearch, { "default-value": "" })];

    expect(findSetup(children, ListSearch)?.props).toEqual({
      defaultValue: "",
    });
  });
});
