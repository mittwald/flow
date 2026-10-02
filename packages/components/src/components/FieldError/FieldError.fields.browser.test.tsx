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
import { FileDropZone } from "@/components/FileDropZone";
import { FileField } from "@/components/FileField";
import { Heading } from "@/components/Heading";
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
  /**
   * The field has no validation state of its own (react-aria provides no
   * `FieldErrorContext`), so a FieldError with a message shows even while the
   * field is valid.
   */
  standalone?: true;
}

const byLabel = () => page.getByLabelText(/^Field/).first();

/*
 * Every field takes a `FieldError` as a child. Inside a field with a validation
 * state the field decides whether it shows, the children only give the
 * message; a field without one shows it whenever it has a message. A shown
 * error describes what assistive technology lands on – the control, or the
 * group for grouped controls – and a hidden one is referenced nowhere.
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
    standalone: true,
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
    standalone: true,
    render: (p) => (
      <Checkbox {...p}>
        Field
        {error}
      </Checkbox>
    ),
    target: () => page.getByRole("checkbox"),
  },
  CheckboxButton: {
    standalone: true,
    render: (p) => (
      <CheckboxButton {...p}>
        Field
        {error}
      </CheckboxButton>
    ),
    target: () => page.getByRole("checkbox"),
  },
  Switch: {
    standalone: true,
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
    standalone: true,
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
    standalone: true,
    render: () => (
      <Autocomplete>
        <SearchField>{label}</SearchField>
        <Option value="a">A</Option>
        {error}
      </Autocomplete>
    ),
    target: () => page.getByRole("searchbox"),
  },
  FileDropZone: {
    standalone: true,
    render: () => (
      <FileDropZone>
        <Heading>Drop</Heading>
        <FileField>
          <Button>Select</Button>
        </FileField>
        {error}
      </FileDropZone>
    ),
    target: () => {
      const input = document.querySelector("input[type=file]");
      if (!input) {
        throw new Error("FileDropZone renders no file input");
      }
      return page.elementLocator(input);
    },
  },
};

/** Every id an `aria-describedby` on the page points to exists. */
const expectNoMissingReference = () => {
  for (const element of document.querySelectorAll("[aria-describedby]")) {
    const ids = (element.getAttribute("aria-describedby") ?? "").split(" ");
    for (const id of ids) {
      expect(document.getElementById(id), `#${id}`).not.toBeNull();
    }
  }
};

describe.each(Object.entries(cases))(
  "%s",
  (_, { render: field, target, standalone }) => {
    test("shows the FieldError of an invalid field and describes the input", async () => {
      await render(<>{field({ isInvalid: true })}</>);

      await expect.element(page.getByText(message)).toBeVisible();
      await expect.element(target()).toHaveAccessibleDescription(/Probe error/);
      expectNoMissingReference();
    });

    test(
      standalone
        ? "shows the FieldError of a valid field – it has no state of its own"
        : "hides the FieldError of a valid field and references nothing",
      async () => {
        await render(<>{field({})}</>);

        if (standalone) {
          await expect.element(page.getByText(message)).toBeVisible();
          await expect
            .element(target())
            .toHaveAccessibleDescription(/Probe error/);
        } else {
          await expect.element(target()).toBeVisible();
          await expect.element(page.getByText(message)).not.toBeInTheDocument();
        }
        expectNoMissingReference();
      },
    );
  },
);
