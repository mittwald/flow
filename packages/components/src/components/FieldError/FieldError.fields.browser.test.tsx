import { render } from "vitest-browser-react";
import { page, type Locator } from "vitest/browser";
import { describe, expect, test } from "vitest";
import type { ReactNode } from "react";
import { Autocomplete } from "@/components/Autocomplete";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { CheckboxButton } from "@/components/CheckboxButton";
import { CheckboxGroup } from "@/components/CheckboxGroup";
import { CodeEditor } from "@/components/CodeEditor";
import { ComboBox } from "@/components/ComboBox";
import { DatePicker } from "@/components/DatePicker";
import { DateRangePicker } from "@/components/DateRangePicker";
import { FieldError } from "@/components/FieldError";
import { FileField } from "@/components/FileField";
import { Label } from "@/components/Label";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { NumberField } from "@/components/NumberField";
import { Option } from "@/components/Option";
import { PasswordCreationField } from "@/components/PasswordCreationField";
import { Radio, RadioGroup } from "@/components/RadioGroup";
import { Rating } from "@/components/Rating";
import { SearchField } from "@/components/SearchField";
import { Segment, SegmentedControl } from "@/components/SegmentedControl";
import { Select } from "@/components/Select";
import { Slider } from "@/components/Slider";
import { Switch } from "@/components/Switch";
import { TextArea } from "@/components/TextArea";
import { TextField } from "@/components/TextField";
import { TimeField } from "@/components/TimeField";

const message = "Probe error message";
const error = <FieldError>{message}</FieldError>;
const label = <Label>Field</Label>;

interface Case {
  render: (props: { isInvalid?: boolean }) => ReactNode;
  /** The element the error has to describe: the control, or its group. */
  target: () => Locator;
}

const byLabel = () => page.getByLabelText(/^Field/).first();

/*
 * Every field takes a `FieldError` as a child. The message is shown whether or
 * not the field itself is invalid, and it describes what assistive technology
 * lands on — the control, or the group for grouped controls.
 *
 * Not covered: `FileDropZone`. `Aria.DropZone` drops `aria-describedby`, and
 * the `FileField` inside has no prop to take it, so its error is shown but not
 * linked.
 */
const cases: Record<string, Case> = {
  TextField: {
    render: (p) => (
      <TextField {...p}>
        {label}
        {error}
      </TextField>
    ),
    target: () => page.getByRole("textbox"),
  },
  TextArea: {
    render: (p) => (
      <TextArea {...p}>
        {label}
        {error}
      </TextArea>
    ),
    target: () => page.getByRole("textbox"),
  },
  NumberField: {
    render: (p) => (
      <NumberField {...p}>
        {label}
        {error}
      </NumberField>
    ),
    target: () => page.getByRole("textbox"),
  },
  SearchField: {
    render: (p) => (
      <SearchField {...p}>
        {label}
        {error}
      </SearchField>
    ),
    target: () => page.getByRole("searchbox"),
  },
  TimeField: {
    render: (p) => (
      <TimeField {...p}>
        {label}
        {error}
      </TimeField>
    ),
    target: () => page.getByRole("group").first(),
  },
  DatePicker: {
    render: (p) => (
      <DatePicker {...p}>
        {label}
        {error}
      </DatePicker>
    ),
    target: () => page.getByRole("group").first(),
  },
  DateRangePicker: {
    render: (p) => (
      <DateRangePicker {...p}>
        {label}
        {error}
      </DateRangePicker>
    ),
    target: () => page.getByRole("group").first(),
  },
  PasswordCreationField: {
    render: (p) => (
      <PasswordCreationField {...p}>
        {label}
        {error}
      </PasswordCreationField>
    ),
    target: byLabel,
  },
  CodeEditor: {
    render: (p) => (
      <CodeEditor {...p}>
        {label}
        {error}
      </CodeEditor>
    ),
    target: () => page.getByRole("textbox"),
  },
  MarkdownEditor: {
    render: (p) => (
      <MarkdownEditor {...p}>
        {label}
        {error}
      </MarkdownEditor>
    ),
    target: () => page.getByRole("textbox"),
  },
  Checkbox: {
    render: (p) => (
      <Checkbox {...p}>
        Field
        {error}
      </Checkbox>
    ),
    target: () => page.getByRole("checkbox"),
  },
  CheckboxButton: {
    render: (p) => (
      <CheckboxButton {...p}>
        Field
        {error}
      </CheckboxButton>
    ),
    target: () => page.getByRole("checkbox"),
  },
  Switch: {
    render: (p) => (
      <Switch {...p}>
        Field
        {error}
      </Switch>
    ),
    target: () => page.getByRole("switch"),
  },
  CheckboxGroup: {
    render: (p) => (
      <CheckboxGroup {...p}>
        {label}
        <Checkbox value="a">A</Checkbox>
        {error}
      </CheckboxGroup>
    ),
    target: () => page.getByRole("group"),
  },
  RadioGroup: {
    render: (p) => (
      <RadioGroup {...p}>
        {label}
        <Radio value="a">A</Radio>
        {error}
      </RadioGroup>
    ),
    target: () => page.getByRole("radiogroup"),
  },
  SegmentedControl: {
    render: (p) => (
      <SegmentedControl {...p}>
        {label}
        <Segment value="a">A</Segment>
        {error}
      </SegmentedControl>
    ),
    target: () => page.getByRole("radiogroup"),
  },
  Rating: {
    render: (p) => (
      <Rating {...p}>
        {label}
        {error}
      </Rating>
    ),
    target: () => page.getByRole("radiogroup"),
  },
  Select: {
    render: (p) => (
      <Select {...p}>
        {label}
        <Option value="a">A</Option>
        {error}
      </Select>
    ),
    target: () => page.getByRole("button"),
  },
  ComboBox: {
    render: (p) => (
      <ComboBox {...p}>
        {label}
        <Option value="a">A</Option>
        {error}
      </ComboBox>
    ),
    target: () => page.getByRole("combobox"),
  },
  Slider: {
    render: (p) => (
      <Slider {...p}>
        {label}
        {error}
      </Slider>
    ),
    target: () => page.getByRole("slider"),
  },
  FileField: {
    render: (p) => (
      <FileField {...p}>
        {label}
        <Button>Select</Button>
        {error}
      </FileField>
    ),
    // The file input is not labelled by the `Label` – look it up directly.
    target: () => {
      const input = document.querySelector("input[type=file]");
      if (!input) {
        throw new Error("FileField renders no file input");
      }
      return page.elementLocator(input);
    },
  },
  "Autocomplete (error in the SearchField)": {
    render: (p) => (
      <Autocomplete>
        <SearchField {...p}>
          {label}
          {error}
        </SearchField>
        <Option value="a">A</Option>
      </Autocomplete>
    ),
    target: () => page.getByRole("searchbox"),
  },
  "Autocomplete (error in the Autocomplete)": {
    render: (p) => (
      <Autocomplete {...p}>
        <SearchField>{label}</SearchField>
        <Option value="a">A</Option>
        {error}
      </Autocomplete>
    ),
    target: () => page.getByRole("searchbox"),
  },
};

describe.each(Object.entries(cases))("%s", (_, { render: field, target }) => {
  test.each([
    ["an invalid field", { isInvalid: true }],
    ["a valid field", {}],
  ])("shows the FieldError in %s and describes the input", async (_, p) => {
    await render(<>{field(p)}</>);

    await expect.element(page.getByText(message)).toBeVisible();
    await expect.element(target()).toHaveAccessibleDescription(/Probe error/);
  });
});
