import CodeEditor from "@/components/CodeEditor";
import DateRangePicker from "@/components/DateRangePicker";
import MarkdownEditor from "@/components/MarkdownEditor";
import NumberField from "@/components/NumberField";
import PasswordCreationField from "@/components/PasswordCreationField";
import SearchField from "@/components/SearchField";
import TextArea from "@/components/TextArea";
import TextField from "@/components/TextField";
import { CalendarDate } from "@internationalized/date";
import type { ReactNode } from "react";
import { expect, test, vitest } from "vitest";
import { render } from "vitest-browser-react";
import { userEvent } from "vitest/browser";

/*
 * `useControlledHostValueProps` mirrors the value of every field that has to
 * survive interleaved host and remote updates, and that mirror is what the
 * field renders. So the mirror decides whether react-stately sees a controlled
 * or an uncontrolled field, and it has to stay on one side of that line for the
 * field's whole life: `useControlledState` reads only `undefined` as
 * uncontrolled, so a mirror that starts out `undefined` and becomes defined
 * with the first change flips the field from uncontrolled to controlled (#3027).
 */

type Rendered = Awaited<ReturnType<typeof render>>;

interface FieldUnderTest {
  toString: () => string;
  /** Rendered with neither `value` nor `defaultValue`. */
  uncontrolled: (onChange: () => void) => ReactNode;
  /** Rendered with a `value` the test never replaces. */
  controlled: (onChange: () => void) => ReactNode;
  /** One interaction that makes the field report a change. */
  change: (dom: Rendered) => Promise<void>;
}

const typeIntoTextbox = async (dom: Rendered) => {
  await userEvent.type(dom.getByRole("textbox"), "x");
};

const typeIntoInput = async (dom: Rendered) => {
  await userEvent.type(dom.getByLocator("input"), "5");
  await userEvent.tab();
};

const fields: FieldUnderTest[] = [
  {
    toString: () => "TextField",
    uncontrolled: (onChange) => (
      <TextField aria-label="Field" onChange={onChange} />
    ),
    controlled: (onChange) => (
      <TextField aria-label="Field" value="held" onChange={onChange} />
    ),
    change: typeIntoTextbox,
  },
  {
    toString: () => "TextArea",
    uncontrolled: (onChange) => (
      <TextArea aria-label="Field" onChange={onChange} />
    ),
    controlled: (onChange) => (
      <TextArea aria-label="Field" value="held" onChange={onChange} />
    ),
    change: typeIntoTextbox,
  },
  {
    toString: () => "SearchField",
    uncontrolled: (onChange) => (
      <SearchField aria-label="Field" onChange={onChange} />
    ),
    controlled: (onChange) => (
      <SearchField aria-label="Field" value="held" onChange={onChange} />
    ),
    change: async (dom) => {
      await userEvent.type(dom.getByRole("searchbox"), "x");
    },
  },
  {
    toString: () => "MarkdownEditor",
    uncontrolled: (onChange) => (
      <MarkdownEditor aria-label="Field" onChange={onChange} />
    ),
    controlled: (onChange) => (
      <MarkdownEditor aria-label="Field" value="held" onChange={onChange} />
    ),
    change: typeIntoTextbox,
  },
  {
    toString: () => "PasswordCreationField",
    uncontrolled: (onChange) => (
      <PasswordCreationField aria-label="Field" onChange={onChange} />
    ),
    controlled: (onChange) => (
      <PasswordCreationField
        aria-label="Field"
        value="Held-Passphrase-1"
        onChange={onChange}
      />
    ),
    change: typeIntoInput,
  },
  {
    toString: () => "CodeEditor",
    uncontrolled: (onChange) => (
      <CodeEditor aria-label="Field" onChange={onChange} />
    ),
    controlled: (onChange) => (
      <CodeEditor aria-label="Field" value="held" onChange={onChange} />
    ),
    change: async (dom) => {
      await userEvent.type(dom.getByLocator(".cm-content"), "x");
    },
  },
  {
    toString: () => "NumberField",
    uncontrolled: (onChange) => (
      <NumberField aria-label="Field" onChange={onChange} />
    ),
    controlled: (onChange) => (
      <NumberField aria-label="Field" value={3} onChange={onChange} />
    ),
    change: typeIntoInput,
  },
  {
    toString: () => "DateRangePicker",
    uncontrolled: (onChange) => (
      <DateRangePicker aria-label="Field" onChange={onChange} />
    ),
    controlled: (onChange) => (
      <DateRangePicker
        aria-label="Field"
        value={{
          start: new CalendarDate(2025, 9, 1),
          end: new CalendarDate(2025, 9, 5),
        }}
        onChange={onChange}
      />
    ),
    change: async (dom) => {
      await dom.getByLocator("button").click();
      await userEvent.keyboard("{Enter}{Enter}");
    },
  },
];

/**
 * The transition is warned about twice: by `react-stately` for the state, and
 * by React DOM for the input element behind it. Both messages name the
 * direction, so one substring each covers a switch either way.
 */
const controlledSwitchWarnings = [
  "uncontrolled to controlled",
  "controlled to uncontrolled",
  "uncontrolled input to be controlled",
  "controlled input to be uncontrolled",
];

const expectNoControlledSwitch = async (
  build: (onChange: () => void) => ReactNode,
  change: (dom: Rendered) => Promise<void>,
) => {
  const warn = vitest.spyOn(console, "warn");
  const error = vitest.spyOn(console, "error");
  const onChange = vitest.fn();

  try {
    const dom = await render(build(onChange));
    await change(dom);

    /* Without a reported change nothing below could ever fail. */
    expect(onChange).toHaveBeenCalled();

    const messages = [...warn.mock.calls, ...error.mock.calls]
      .flat()
      .join("\n");

    for (const warning of controlledSwitchWarnings) {
      expect(messages).not.toContain(warning);
    }
  } finally {
    warn.mockRestore();
    error.mockRestore();
  }
};

test.each(fields)(
  "%s does not switch between controlled and uncontrolled when nothing controls its value",
  async (field) => {
    await expectNoControlledSwitch(field.uncontrolled, field.change);
  },
);

test.each(fields)(
  "%s does not switch between controlled and uncontrolled while its value is held",
  async (field) => {
    await expectNoControlledSwitch(field.controlled, field.change);
  },
);
