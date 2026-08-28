---
since: 0.2.0-alpha.780
title: CartesianChart
kind: migration
action: manual
remotePackage: true
apply:
  Add `dataKeyLabel` wherever a `dataKey` is a function — a string `dataKey`
  already sets it automatically. Where a `tickFormatter` or other callback
  relied on the argument being `any`, add an explicit type check (for example
  `instanceof Date`), or switch to `typedCartesianChart<T>()` for a chart whose
  callbacks are typed from your own data shape.
---

> If you're using a _Function_ in the `dataKey` - you need to define a
> `dataKeyLabel` as well.

The `dataKeyLabel` is required to identify the RowData in the formatter
functions. If a `string` is used - this will automatically be used as the
`dataKeyLabel`.

```diff
- <XAxis dataKey={() => 1337} />
+ <XAxis dataKey={() => 1337} dataKeyLabel={"leet"} />
```

---

> The Data Types from the CartesianChart have changed from `any` to `unknown`.

**Before (With type `any`):**

```tsx
const data = [
  {
    amount: 1,
    time: new Date("2026-08-11"),
  }
];

<CartesianChart data={data}>>
  <XAxis
    dataKey="time"
    tickFormatter={(date) =>
      // date is typeof any
      Intl.DateTimeFormat("de", {
        month: "short",
        day: "2-digit",
      }).format(date)
    }
  />
</CartesianChart>
```

**Now:** now you need to check the type explicit e.g.

```tsx
<XAxis
  dataKey="time"
  tickFormatter={(date) => {
    // date is typeof unknown
    if (date instanceof Date) {
      return Intl.DateTimeFormat("de", {
        month: "short",
        day: "2-digit",
      }).format(date);
    }
  }}
/>
```

or use the **new** `typedCartesianChart` which infers the type automatically

```tsx
interface ChartData {
  amount: number;
  time: Date,
};

const data: ChartData[] = [
  {
    amount: 1,
    time: new Date("2026-08-11"),
  }
];

const ExampleChart = typedCartesianChart<ChartData>();

<ExampleChart.Chart data={data}>>
  <ExampleChart.XAxis
    dataKey="time"
    tickFormatter={(date) =>
      // date is typeof Date
      Intl.DateTimeFormat("de", {
        month: "short",
        day: "2-digit",
      }).format(date)
    }
  />
</ExampleChart.Chart>
```
