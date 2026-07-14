# Migrations

## Stylesheet: CSS Cascade Layers

> Flow's generated stylesheet is now wrapped in CSS Cascade Layers. **Unlayered
> CSS in your application now always overrides Flow's styles, regardless of
> specificity.**

The stylesheet is organized under a top-level `flow` layer:

```css
@layer flow.tokens, flow.reset, flow.base, flow.components;
```

**Before:** overriding a Flow style required matching or exceeding its
specificity (nested selectors or `!important`).

**Now:** any unlayered rule wins:

```css
.flow--button {
  border-radius: 0;
}
```

If you rely on your own global element styles or resets losing against Flow, note
that unlayered styles now **win** against Flow's (layered) styles. Move such
styles into a layer declared before `flow`, or raise their intent.

If you use CSS Cascade Layers yourself (e.g. Tailwind), declare your layers
**after** `flow` so they keep precedence.

**Extreme case — a global `* { all: initial }` reset:** an unlayered reset like
this now overrides **every** Flow style and leaves components unstyled. Either move
the reset into a layer declared before `flow`, or use the unlayered stylesheet
variant below.

**Opt-out — unlayered variant:** if you cannot adopt layers, import the unlayered
build instead. It ships the same styles without `@layer`, so Flow's `.flow--*`
selectors win by specificity again (you lose easy layer-based overriding):

```ts
import "@mittwald/flow-react-components/all.unlayered.css";
// or, from the standalone stylesheet package:
import "@mittwald/flow-stylesheet/css-unlayered";
```

---

## From version `0.2.0-alpha.779` to `>=0.2.0-alpha.780`

### CartesianChart

> If you're using a _Function_ in the `dataKey` - you need to define a
> `dataKeyLabel` as well.

The `dataKeyLabel` is required to identify the RowData in the formatter
functions. If a `string` is used - this will automatically be used as the
`dataKeyLabel`.

**Before:**

```tsx
<XAxis dataKey={() => 1337} />
```

**Now:**

```tsx
<XAxis dataKey={() => 1337} dataKeyLabel={"leet"} />
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

---

## From version 0.1.0 to version 0.2.0

With the latest update to `@mittwald/flow-react-components`, the way package
exports are handled has changed. You no longer need to specify subdirectories
explicitly when importing components and utilities. Instead, imports are now
structured in a more streamlined way.

## Changes in Imports

Previously, you had to import components and utilities from specific
subdirectories, like this:

```javascript
import Button from "@mittwald/flow-react-components/Button";
import { useOverlayController } from "@mittwald/flow-react-components/controller";
import Field from "@mittwald/flow-react-components/react-hook-form/Field";
import { Link } from "@mittwald/flow-react-components/react-hook-form/nextjs";
```

With the new package structure, the same imports should be rewritten as follows:

```javascript
import { Button } from "@mittwald/flow-react-components";
import { useOverlayController } from "@mittwald/flow-react-components";
import { Field } from "@mittwald/flow-react-components/react-hook-form";
import { Link } from "@mittwald/flow-react-components/nextjs";
```

## `tsconfig.json`

Set `"module": "esnext"` in your `tsconfig.json`, if you have trouble with
missing module exports.

## Migration Steps

### Use Codemod

```shell
npx jscodeshift \
  -t https://raw.githubusercontent.com/mittwald/flow/refs/heads/main/packages/codemods/src/transforms/flow020.ts \
  --parser tsx \
  src
```

Replace `src` with your sources folder. If you do not use TypeScript in your
project, use `--parser jsx`.

See the [docs of jscodeshift](https://jscodeshift.com/run/cli/)

### Do it manually

1. **Update all import statements** in your project according to the new
   structure.
2. **Remove unnecessary subdirectory paths** from imports.
3. **Verify your application still compiles and runs correctly.**
4. **Run your test suite** to ensure no regressions were introduced by the
   migration.

## Benefits of This Change

- **Simplified import statements** with a clearer structure.
- **Better maintainability** as package updates no longer require path
  modifications.
- **Improved autocompletion support** in modern IDEs.

## From version 0.1.0-alpha.291 to 0.1.0-alpha.292

### Renamed CSS export

The CSS export `@mittwald/flow-react-components/styles` has renamed to the more
precise name `@mittwald/flow-react-components/all.css`, because the file
contains the CSS of all components, and now there are CSS exports per component
as well. A documentation on how to use them is planned.

```diff
// main.js
- import "@mittwald/flow-react-components/styles";
+ import "@mittwald/flow-react-components/all.css";
```
