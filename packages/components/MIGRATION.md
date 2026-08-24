# Migrations

---

## From version `0.2.0-alpha.1045` to `>=0.2.0-alpha.1046`

### Align renamed to Combine

`Align` is now called `Combine`. The old name suggested a generic alignment tool
and clashed with the `align` property of `Flex`; the component actually gives
known combinations of components a fixed, correct arrangement.

```diff
- <Align>
+ <Combine>
    <Avatar />
    <Text>Max Mustermann</Text>
- </Align>
+ </Combine>
```

`Align` (and the `flr-align` remote element) keeps working unchanged, logs a
deprecation warning at runtime, and will be removed in a future major version.

A codemod renames `Align` to `Combine` and `AlignProps` to `CombineProps`:

```shell
npx jscodeshift \
  -t https://raw.githubusercontent.com/mittwald/flow/refs/heads/main/packages/codemods/src/transforms/flowAlphaAlignToCombine.ts \
  --parser tsx \
  src
```

Replace `src` with your sources folder.

The component tokens were renamed along with the component
(`--align--avatar-text--spacing` is now `--combine--avatar-text--spacing`), and
so were the CSS class names (`.flow--align` is now `.flow--combine`). Both are
internal and not covered by Semantic Versioning.

---

## From version `0.2.0-alpha.1007` to `>=0.2.0-alpha.1016`

### TooltipTrigger changed delay type

Numeric delay values are no longer accepted; only string literals are valid.

```diff
- <TooltipTrigger delay={300} />
+ <TooltipTrigger delay="default" />

- <TooltipTrigger delay={500} />
+ <TooltipTrigger delay="long" />
```

## From version `0.2.0-alpha.1004` to `>=0.2.0-alpha.1005`

### Closing a Modal with unsaved changes is confirmed by default

A `Modal` that contains a react-hook-form `<Form>` now asks for confirmation
before it closes while the form is _dirty_ — previously this required the
`requireCloseModalConfirmationOnUnsavedChanges` flag. After a successful submit
or a `form.reset()` the modal closes right away, and actions in the
`<ActionGroup />` as well as the close button in the heading still close it
immediately.

Nothing to do if you had the flag enabled. To keep the previous behavior, switch
the default off (see below).

### `flags` is replaced by the ComponentDefaultsProvider

The global `flags` object is deprecated. Application-wide defaults are defined
with the `<ComponentDefaultsProvider />` instead, which additionally works per
subtree:

```diff
- import { flags } from "@mittwald/flow-react-components";
-
- flags.requireCloseModalConfirmationOnUnsavedChanges = false;
- flags.disableInitialListSuspenseBoundaries = true;
+ import { ComponentDefaultsProvider } from "@mittwald/flow-react-components";
+
+ <ComponentDefaultsProvider
+   defaults={{
+     Form: { confirmModalCloseOnUnsavedChanges: false },
+     List: { disableInitialSuspenseBoundary: true },
+   }}
+ >
+   <App />
+ </ComponentDefaultsProvider>
```

Assigning a flag keeps working — it acts as the application-wide default below
the provider and logs a deprecation warning — but the flags will be removed in a
future release.

---

## From version `0.2.0-alpha.933` to `>=0.2.0-alpha.956`

### TableColumn: `maxWidth` removed, `width` and `minWidth` retyped

`maxWidth` has been removed. `width` and `minWidth` are now typed as
`number | string`: they no longer accept `null`, and the previous
template-literal typing (`` `${number}%` ``, `` `${number}fr` ``) is replaced by
a plain `string`.

```diff
- <TableColumn width="50%" minWidth={null} maxWidth={400} />
+ <TableColumn width="50%" />
```

Percentage, pixel and `fr` values keep working as strings or numbers
(`width="50%"`, `width="200fr"`, `width={300}`). Where you passed `null` to mean
"no explicit width", omit the prop instead.

---

## From version `0.2.0-alpha.857` to `>=0.2.0-alpha.866`

### Table: `render` prop removed

The `render` escape hatch on `Table` has been removed. Compose the table from
`TableHeader`, `TableColumn`, `TableBody`, `TableRow` and `TableCell` instead.

---

## From version `0.2.0-alpha.837` to `>=0.2.0-alpha.846`

### TableCell: `render` prop removed

The `render` escape hatch on `TableCell` has been removed. Provide the cell
content as children instead.

```diff
- <TableCell render={(cell) => <CustomCell {...cell} />} />
+ <TableCell>
+  <CustomCell />
+ </TableCell>
```

### Breadcrumb, HeaderNavigation, Heading, IllustratedMessage, and Link: color property "primary" renamed to "default"

The `color="primary"` property has been renamed to `color="default"`.

```diff
- <Link color="primary">
+ <Link color="default" />
```

A codemod rewrites `color="primary"` to `color="default"` on these five
components (and leaves other components such as `Button`, where `"primary"` is
still valid, untouched):

```shell
npx jscodeshift \
  -t https://raw.githubusercontent.com/mittwald/flow/refs/heads/main/packages/codemods/src/transforms/flowAlphaColorPrimaryToDefault.ts \
  --parser tsx \
  src
```

Replace `src` with your sources folder.

---

## From version `0.2.0-alpha.779` to `>=0.2.0-alpha.780`

### CartesianChart

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

---

## From version `0.2.0-alpha.777` to `>=0.2.0-alpha.786`

### AccentBox.color is now a declaration for foreground

The `color` property now controls foreground colors. Use the `backgroundColor`
property to set the background color instead.

```diff
- <AccentBox color="gradient">
+ <AccentBox backgroundColor="gradient" />
```

---

## From version `0.2.0-alpha.747` to `>=0.2.0-alpha.756`

### Removed the underlying react-syntax-highlighter library from CodeBlock

We've replaced the `react-syntax-highlighter` library, which means many
properties have been removed and the remaining ones have been simplified. See
the
[CodeBlock documentation](https://flow.mittwald.de/04-components/content/code-block/overview)
for details on what's now supported.

---

## From version `0.2.0-alpha.676` to `>=0.2.0-alpha.696`

### OverlayController.addOnClose / addOnOpen return type changed

The return type changed from `() => void` to `() => unknown`

---

## From version `0.2.0-alpha.667` to `>=0.2.0-alpha.676`

### CartesianChart.emptyView changed

Component references are no longer accepted for `emptyView` - must be a rendered
element now.

```diff
- <CartesianChart emptyView={EmptyState} />
+ <CartesianChart emptyView={<EmptyState />} />
```

---

## From version `0.2.0-alpha.637` to `>=0.2.0-alpha.646`

### Removed ResetButton and SubmitButton Interfaces

The `RemoteButtonElementProps`, `ResetButtonProps`, and `SubmitButtonProps`
interfaces have been removed. Use `ButtonProps` instead.

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
