# Building a form field

Part of the
[components agent guide](https://github.com/mittwald/flow/blob/main/packages/components/AGENTS.md),
split out because only form-field work needs it.

A form field is any component a user enters a value with — anything that calls
`useFieldComponent`. It supports the whole contract below, end to end: prop →
behavior → styling → `Label` state → test. Gaps in existing fields are tracked
in #3368.

| Aspect                          | Requirement                                                                                                                                                                                                                     |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `isDisabled`                    | Control is not operable (`disabled` or `aria-disabled`), disabled styling via the `formControl` mixin, `Label` disabled. Every inner button too.                                                                                |
| `isReadOnly`                    | Value cannot change, control still focusable and submitted. Native `readonly` / react-aria's `isReadOnly` where it exists, otherwise `aria-readonly` — never by disabling the control. Inner buttons that change the value off. |
| `isRequired`                    | `required` or `aria-required` on the control; `Label` drops its "optional" marker (`useFieldComponent` does that).                                                                                                              |
| `isInvalid`                     | `aria-invalid` on the control, invalid styling, `FieldError` rendered and linked.                                                                                                                                               |
| `validationBehavior`            | `"native"` blocks form submission on a constraint violation, `"aria"` does not. react-hook-form's `Field` passes `"aria"`.                                                                                                      |
| `Label` / `FieldDescription`    | Children slots via `useFieldComponent`; `Label` names the control. `controlProps` (with `aria-describedby`) land on the **focusable control** (or the group of a grouped control), not on a wrapper `div`.                      |
| `name` / `form`                 | The value is in the `FormData` of the surrounding (or `form`-referenced) form. A custom control renders a hidden input.                                                                                                         |
| `defaultValue` / `value`        | Both work; `onChange` reports user changes with the field's own value type (a `number` field reports a `number`).                                                                                                               |
| `ref`                           | Points at the focusable control — react-hook-form focuses it on a validation error.                                                                                                                                             |
| `autoFocus`, `onFocus`/`onBlur` | Reach the focusable control. react-hook-form marks a field touched via `onBlur`.                                                                                                                                                |

An exception needs a reason that holds for the field's nature (a `Slider` always
has a value, so it has no required state) — not "not implemented yet".

Checklist beyond the component itself:

- **Contract test.** Call `testFormFieldContract`
  (`src/tests/formFieldContract/`) in the field's `*.browser.test.tsx`. The
  adapter renders the field, names its control, two values (the first one
  submits an entry, the two submit different entries), their `FormData` entries
  and a user interaction that changes the value. The interaction passes `force`
  on, so the test can also try it on a disabled or read-only field.
  `getValueButtons` narrows the inner buttons a read-only field turns off; it
  defaults to all. Justified exceptions go in `exceptions` with their reason. An
  excepted aspect must fail on one of its own expectations — once it passes, or
  fails on a lookup or a timeout instead, the run fails:

  ```tsx
  testFormFieldContract("TextField", {
    render: (props) => <TextField {...props} />,
    getControl: (screen) => screen.getByRole("textbox"),
    values: ["foo", "bar"],
    toFormValue: (value) => value,
    changeValue: async (screen, { force }) => {
      await userEvent.fill(screen.getByRole("textbox"), "bar", { force });
    },
  });
  ```

  It checks behavior and ARIA, not looks — the disabled, read-only and invalid
  states also get scenarios in the field's visual test
  (`packages/remote-react-components/src/tests/visual`).

- **react-hook-form.** Register the field in the props context of
  `src/integrations/react-hook-form/components/Field/Field.tsx`. `Field` passes
  `name`, `value` and `defaultValue` together, `onChange`, `onBlur`, `ref`,
  `form`, `isRequired`, `isReadOnly`, `isInvalid` and `validationBehavior` —
  spread the rest props through instead of destructuring a fixed list, or they
  are dropped silently. A field whose value prop is not `value` gets it mapped
  there (`selectedKey` for `ComboBox`, `isSelected` for `Checkbox`). `Field`
  does not pass `isDisabled` yet (#3368).
- **Remote.** A field that mirrors its value with `useControlledHostValueProps`
  passes the type's empty value (see the controlled-from-the-first-render
  convention in
  [AGENTS.md](https://github.com/mittwald/flow/blob/main/packages/components/AGENTS.md#non-obvious-conventions)).
  A text input among them also needs its `flr-*` tag in
  `controlledComponentNames`
  (`packages/remote-react-components/src/lib/createRemoteComponent.ts`), or it
  drops characters under fast typing
  ([docs/remote-ui.md](https://github.com/mittwald/flow/blob/main/docs/remote-ui.md)).
