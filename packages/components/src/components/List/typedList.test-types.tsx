import { typedList } from "@/components/List/typedList";
import React from "react";
import { expectTypeOf } from "vitest";

interface Item {
  id: number;
  name: string;
  labels?: string[];
}

const ItemList = typedList<Item>();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function filters() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function testKnownProperty() {
    <ItemList.Filter property="id" />;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function testCustomProperty() {
    <ItemList.Filter property="$custom" />;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function testUnknownProperty() {
    // @ts-expect-error Is unknown
    <ItemList.Filter property="foo" />;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function testMatcherParameters() {
    <ItemList.Filter
      property="id"
      matcher={(filter, prop) => {
        expectTypeOf(filter).toBeNumber();
        expectTypeOf(prop).toBeNumber();
        return true;
      }}
    />;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function testCustomMatcherParameters1() {
    <ItemList.Filter
      property="$custom"
      matcher={(filter, item) => {
        expectTypeOf(filter).toMatchTypeOf<Item>();
        expectTypeOf(item).toMatchTypeOf<Item>();
        return true;
      }}
    />;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function testCustomMatcherParameters2() {
    <ItemList.Filter
      property="$custom"
      values={[1, 2, 3]}
      matcher={(filter, item) => {
        expectTypeOf(filter).toBeNumber();
        expectTypeOf(item).toMatchTypeOf<Item>();
        return true;
      }}
    />;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function testMatcherParametersWhenValuesAreSet() {
    <ItemList.Filter
      values={["foo", "bar"]}
      property="id"
      matcher={(filter, prop) => {
        expectTypeOf(filter).toBeString();
        expectTypeOf(prop).toBeNumber();
        return true;
      }}
    />;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function testMatcherParametersForArrayProps() {
    <ItemList.Filter
      property="labels"
      matcher={(filter, prop) => {
        expectTypeOf(filter).toBeString();
        expectTypeOf(prop).toEqualTypeOf<string[] | undefined>();
        return true;
      }}
    />;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function testValueTypeForRenderMethod1() {
    <ItemList.Filter property="labels">
      {(label) => {
        expectTypeOf(label).toBeString();
        return null;
      }}
    </ItemList.Filter>;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function testValueTypeForRenderMethod2() {
    <ItemList.Filter property="id">
      {(label) => {
        expectTypeOf(label).toBeNumber();
        return null;
      }}
    </ItemList.Filter>;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function testValueTypeForRenderMethod3() {
    <ItemList.Filter property="$custom">
      {(item) => {
        expectTypeOf(item).toMatchTypeOf<Item>();
        return null;
      }}
    </ItemList.Filter>;
  }
}
