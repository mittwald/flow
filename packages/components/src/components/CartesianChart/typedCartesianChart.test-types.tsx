import React, { type ReactNode } from "react";
import { expectTypeOf } from "vitest";
import { typedCartesianChart } from "@/components/CartesianChart/CartesianChart";
import { ChartTooltip } from "@/components/CartesianChart/components/ChartTooltip";
import { ChartLegend } from "@/components/CartesianChart/components/ChartLegend";
import { XAxis } from "@/components/CartesianChart/components/XAxis";
import type { ChartDataValue } from "@/components/CartesianChart/types";
import { Area } from "@/components/CartesianChart/components/Area";

interface ChartData {
  time: Date;
  count: number;
}

const ExampleChartWithoutXAxisType = typedCartesianChart<ChartData>();
const ExampleChartWithXAxisType = typedCartesianChart<ChartData, "time">();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function filters() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function testKnownProperty() {
    <ExampleChartWithoutXAxisType.Area dataKey="count" />;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function testUnknownProperty() {
    // @ts-expect-error Is unknown
    <ExampleChartWithoutXAxisType.Area dataKey="shouldError" />;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function testDataKeyFnForbidden() {
    // @ts-expect-error Is unknown
    <ExampleChartWithoutXAxisType.Area dataKey={() => 3} />;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function testLegendFormatter() {
    <ExampleChartWithXAxisType.Legend
      formatter={(text, index) => {
        expectTypeOf(text).toBeString();
        expectTypeOf(index).toBeNumber();
        return "foo";
      }}
    />;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function testTooltipFormatters() {
    <ExampleChartWithXAxisType.Tooltip
      formatter={(value, name, index, unit) => {
        expectTypeOf(value).toMatchTypeOf<ChartData[keyof ChartData]>();
        expectTypeOf(name).toMatchTypeOf<keyof ChartData>();
        expectTypeOf(index).toBeNumber();
        expectTypeOf(unit).toMatchTypeOf<ReactNode>();
        return "foo";
      }}
      headingFormatter={(title) => {
        expectTypeOf(title).toMatchTypeOf<Date>();
        return "foo";
      }}
      progressBarFormatter={(value, unit) => {
        expectTypeOf(value).toBeNumber();
        expectTypeOf(unit).toMatchTypeOf<ReactNode>();
        return "foo";
      }}
    />;
    <ExampleChartWithoutXAxisType.Tooltip
      formatter={(value, name, index, unit) => {
        expectTypeOf(value).toMatchTypeOf<ChartData[keyof ChartData]>();
        expectTypeOf(name).toMatchTypeOf<keyof ChartData>();
        expectTypeOf(index).toBeNumber();
        expectTypeOf(unit).toMatchTypeOf<ReactNode>();
        return "foo";
      }}
      headingFormatter={(title) => {
        expectTypeOf(title).toMatchTypeOf<ChartData[keyof ChartData]>();
        return "foo";
      }}
      progressBarFormatter={(value, unit) => {
        expectTypeOf(value).toBeNumber();
        expectTypeOf(unit).toMatchTypeOf<ReactNode>();
        return "foo";
      }}
    />;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function testXAxisTypeIsAlwaysInferFromDataKey() {
    <ExampleChartWithoutXAxisType.XAxis
      dataKey="time"
      tickFormatter={(value, index) => {
        expectTypeOf(value).toMatchTypeOf<Date>();
        expectTypeOf(index).toBeNumber();
        return "foo";
      }}
    />;
    <ExampleChartWithXAxisType.XAxis
      dataKey="time"
      tickFormatter={(value, index) => {
        expectTypeOf(value).toMatchTypeOf<Date>();
        expectTypeOf(index).toBeNumber();
        return "foo";
      }}
    />;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function testXAxisTypeIsLoseTyped() {
    <ExampleChartWithoutXAxisType.XAxis
      dataKey="count"
      tickFormatter={(value, index) => {
        expectTypeOf(value).toBeNumber();
        expectTypeOf(index).toBeNumber();
        return "foo";
      }}
    />;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function testXAxisTypeIsStrictTyped() {
    // @ts-expect-error Is unknown
    <ExampleChartWithXAxisType.XAxis dataKey="count" />;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function testUntypedTooltipFormatters() {
    <ChartTooltip
      formatter={(value, name, index, unit) => {
        expectTypeOf(value).toBeUnknown();
        expectTypeOf(name).toBeString();
        expectTypeOf(index).toBeNumber();
        expectTypeOf(unit).toMatchTypeOf<ReactNode>();
        return "foo";
      }}
      headingFormatter={(title) => {
        expectTypeOf(title).toBeUnknown();
        return "foo";
      }}
      progressBarFormatter={(value, unit) => {
        expectTypeOf(value).toBeNumber();
        expectTypeOf(unit).toMatchTypeOf<ReactNode>();
        return "foo";
      }}
    />;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function testUntypedLegend() {
    <ChartLegend
      formatter={(text, index) => {
        expectTypeOf(text).toBeString();
        expectTypeOf(index).toBeNumber();
        return "foo";
      }}
    />;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function testUntypedDataKey() {
    <XAxis dataKey="foo" />;
    <XAxis
      dataKey={(data) => {
        expectTypeOf(data).toMatchTypeOf<ChartDataValue>();
        return 1337;
      }}
    />;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function testUntypedAreaWithDataKeyAndLabel() {
    <Area dataKey="foo" />;
    <Area
      dataKey={(data) => {
        expectTypeOf(data).toMatchTypeOf<ChartDataValue>();
        return 1337;
      }}
      dataKeyLabel={"foo"}
    />;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function testUntypedAreaWithDataKeyMissingLabel() {
    // @ts-expect-error Is unknown
    <Area
      dataKey={(data) => {
        expectTypeOf(data).toMatchTypeOf<ChartDataValue>();
        return 1337;
      }}
    />;
  }
}
