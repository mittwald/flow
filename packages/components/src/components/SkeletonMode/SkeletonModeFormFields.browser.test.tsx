import type { ReactNode } from "react";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { expect, test } from "vitest";
import { SkeletonMode } from "@/components/SkeletonMode";
import { Label } from "@/components/Label";
import { Text } from "@/components/Text";
import { Content } from "@/components/Content";
import { Button } from "@/components/Button";
import { Option } from "@/components/Option";
import { FieldDescription } from "@/components/FieldDescription";
import { FieldError } from "@/components/FieldError";
import { TextField } from "@/components/TextField";
import { TextArea } from "@/components/TextArea";
import { NumberField } from "@/components/NumberField";
import { SearchField } from "@/components/SearchField";
import { PasswordCreationField } from "@/components/PasswordCreationField";
import { Select } from "@/components/Select";
import { ComboBox } from "@/components/ComboBox";
import { Autocomplete } from "@/components/Autocomplete";
import { DatePicker } from "@/components/DatePicker";
import { DateRangePicker } from "@/components/DateRangePicker";
import { TimeField } from "@/components/TimeField";
import { FileField } from "@/components/FileField";
import { Slider } from "@/components/Slider";
import { Segment, SegmentedControl } from "@/components/SegmentedControl";
import { Checkbox } from "@/components/Checkbox";
import { CheckboxGroup } from "@/components/CheckboxGroup";
import { CheckboxButton } from "@/components/CheckboxButton";
import { Radio, RadioButton, RadioGroup } from "@/components/RadioGroup";
import { Switch } from "@/components/Switch";
import barStyles from "./components/SkeletonTextContent/SkeletonTextContent.module.scss";

const fields = () => [
  <TextField key="textField" type="password">
    <Label>Datenbankname</Label>
    <FieldDescription>Nur Kleinbuchstaben</FieldDescription>
  </TextField>,
  <TextArea key="textArea">
    <Label>Beschreibung</Label>
  </TextArea>,
  <NumberField key="numberField">
    <Label>Anzahl</Label>
  </NumberField>,
  <SearchField key="searchField">
    <Label>Suche</Label>
  </SearchField>,
  <PasswordCreationField key="passwordCreationField">
    <Label>Passwort</Label>
  </PasswordCreationField>,
  <Select key="select">
    <Label>PHP-Version</Label>
    <Option>8.3</Option>
    <Option>8.4</Option>
  </Select>,
  <ComboBox key="comboBox">
    <Label>Domain</Label>
    <Option>example-domain.de</Option>
  </ComboBox>,
  <Autocomplete key="autocomplete">
    <TextField>
      <Label>E-Mail-Adresse</Label>
    </TextField>
    <Option>info@example-domain.de</Option>
  </Autocomplete>,
  <DatePicker key="datePicker">
    <Label>Startdatum</Label>
  </DatePicker>,
  <DateRangePicker key="dateRangePicker">
    <Label>Zeitraum</Label>
  </DateRangePicker>,
  <TimeField key="timeField">
    <Label>Uhrzeit</Label>
  </TimeField>,
  <FileField key="fileField">
    <Label>Zertifikat</Label>
    <Button>Datei auswählen</Button>
  </FileField>,
  <Slider key="slider" defaultValue={20}>
    <Label>Speicherplatz</Label>
  </Slider>,
  <SegmentedControl key="segmentedControl" defaultValue="day">
    <Label>Intervall</Label>
    <Segment value="day">Täglich</Segment>
    <Segment value="week">Wöchentlich</Segment>
  </SegmentedControl>,
  <Checkbox key="checkbox">Newsletter abonnieren</Checkbox>,
  <CheckboxGroup key="checkboxGroup">
    <Label>Benachrichtigungen</Label>
    <Checkbox value="mail">E-Mail</Checkbox>
  </CheckboxGroup>,
  <CheckboxButton key="checkboxButton">
    <Text>Backup</Text>
    <Content>Tägliche Sicherung</Content>
  </CheckboxButton>,
  <RadioGroup key="radioGroup" defaultValue="ssd">
    <Label>Speicher</Label>
    <Radio value="ssd">SSD</Radio>
    <RadioButton value="hdd">
      <Text>HDD</Text>
    </RadioButton>
  </RadioGroup>,
  <Switch key="switch">Automatische Updates</Switch>,
];

const skeletonRoots = () => document.querySelectorAll("[data-skeleton]");

/** The texts of all bars, without the optional marker of labels, sorted. */
const bars = () =>
  [...document.querySelectorAll(`.${barStyles.skeletonTextContent}`)]
    .map((bar) => bar.textContent.replace("(optional)", "").trim())
    .sort();

// The Slider's output has the role `status` as well.
const status = () => page.getByText("Loading content");

/** Renders `children` and an input to tab to after them. */
const renderWithInputAfter = (children: ReactNode) =>
  render(
    <>
      {children}
      {/* WebKit skips buttons on Tab, a text input is always tabbable. */}
      <input aria-label="After" />
    </>,
  );

const afterInput = () => page.getByRole("textbox", { name: "After" });

const query = <T extends Element>(selector: string): T => {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`No element matches ${selector}`);
  }
  return element;
};

test("every field root is inert and marked", async () => {
  await render(<SkeletonMode>{fields()}</SkeletonMode>);
  await expect.element(status()).toBeInTheDocument();

  // Autocomplete wraps a TextField, and CheckboxGroup and RadioGroup contain
  // a Checkbox and radios.
  const roots = [...skeletonRoots()];
  expect(roots).toHaveLength(fields().length + 2);
  expect(roots.every((root) => root.hasAttribute("inert"))).toBe(true);
});

test("no focusable element is outside an inert field", async () => {
  await render(<SkeletonMode>{fields()}</SkeletonMode>);
  await expect.element(status()).toBeInTheDocument();

  const focusables = [
    ...document.querySelectorAll(
      "input, textarea, button, [tabindex], [contenteditable]",
    ),
  ].filter(
    // DatePicker's hidden autofill input sits next to its root, out of the
    // tab order and visually hidden.
    (el) => !el.matches("input[type=date][tabindex='-1']"),
  );

  expect(focusables.length).toBeGreaterThan(fields().length);
  expect(focusables.filter((el) => !el.closest("[inert]"))).toEqual([]);
});

test("Tab skips every field", async () => {
  await renderWithInputAfter(<SkeletonMode>{fields()}</SkeletonMode>);
  await expect.element(status()).toBeInTheDocument();

  await userEvent.tab();

  await expect.element(afterInput()).toHaveFocus();
});

test("typing into a text field does nothing", async () => {
  await render(
    <SkeletonMode>
      <TextField>
        <Label>Datenbankname</Label>
      </TextField>
    </SkeletonMode>,
  );
  await expect.element(status()).toBeInTheDocument();
  const input = query<HTMLInputElement>("input");

  input.focus();
  await userEvent.click(input, { force: true });
  await userEvent.keyboard("wordpress");

  expect(document.activeElement).not.toBe(input);
  expect(input.value).toBe("");
});

test.each([
  [
    "Select",
    <Select key="select">
      <Label>PHP-Version</Label>
      <Option>8.4</Option>
    </Select>,
  ],
  [
    "ComboBox",
    <ComboBox key="comboBox">
      <Label>Domain</Label>
      <Option>example-domain.de</Option>
    </ComboBox>,
  ],
  [
    "DatePicker",
    <DatePicker key="datePicker">
      <Label>Startdatum</Label>
    </DatePicker>,
  ],
  [
    "DateRangePicker",
    <DateRangePicker key="dateRangePicker">
      <Label>Zeitraum</Label>
    </DateRangePicker>,
  ],
])("a press on the %s trigger opens nothing", async (_, field) => {
  await render(<SkeletonMode>{field}</SkeletonMode>);
  await expect.element(status()).toBeInTheDocument();

  // `force` skips playwright's actionability checks, the click still lands on
  // the trigger's position like a real one.
  await userEvent.click(query("button"), { force: true });
  await userEvent.keyboard("{ArrowDown}");
  // Gives an opening overlay time to render.
  await new Promise((resolve) => setTimeout(resolve, 300));

  expect(document.querySelector("[role=listbox]")).toBeNull();
  expect(document.querySelector("[role=dialog]")).toBeNull();
});

test("a press changes no checkbox, radio, switch or number", async () => {
  await render(
    <SkeletonMode>
      <Checkbox>Newsletter abonnieren</Checkbox>
      <CheckboxButton>Backup</CheckboxButton>
      <RadioGroup>
        <Label>Speicher</Label>
        <Radio value="ssd">SSD</Radio>
      </RadioGroup>
      <Switch>Automatische Updates</Switch>
      <NumberField defaultValue={2}>
        <Label>Anzahl</Label>
      </NumberField>
    </SkeletonMode>,
  );
  await expect.element(status()).toBeInTheDocument();

  for (const label of document.querySelectorAll("label")) {
    await userEvent.click(label, { force: true });
  }
  for (const button of document.querySelectorAll("button")) {
    await userEvent.click(button, { force: true });
  }

  const checked = [
    ...document.querySelectorAll<HTMLInputElement>("input[type=checkbox]"),
    ...document.querySelectorAll<HTMLInputElement>("input[type=radio]"),
  ].filter((input) => input.checked);
  expect(checked).toEqual([]);
  expect(query<HTMLInputElement>("input[inputmode]").value).toBe("2");
});

test("labels, descriptions and choice labels become bars", async () => {
  await render(
    <SkeletonMode>
      <TextField>
        <Label>Datenbankname</Label>
        <FieldDescription>Nur Kleinbuchstaben</FieldDescription>
      </TextField>
      <Checkbox>Newsletter abonnieren</Checkbox>
      <RadioGroup>
        <Label>Speicher</Label>
        <Radio value="ssd">SSD</Radio>
      </RadioGroup>
      <Switch>Automatische Updates</Switch>
      <Slider defaultValue={20}>
        <Label>Speicherplatz</Label>
      </Slider>
    </SkeletonMode>,
  );
  await expect.element(status()).toBeInTheDocument();

  expect(bars()).toEqual(
    [
      "Datenbankname",
      "Nur Kleinbuchstaben",
      "Newsletter abonnieren",
      "Speicher",
      "SSD",
      "Automatische Updates",
      "20",
      "Speicherplatz",
    ].sort(),
  );
});

test("the content of a checkbox or radio button draws no bars", async () => {
  await render(
    <SkeletonMode>
      <CheckboxButton>
        <Text>Backup</Text>
        <Content>Tägliche Sicherung</Content>
      </CheckboxButton>
      <RadioGroup>
        <Label>Speicher</Label>
        <RadioButton value="ssd">
          <Text>SSD</Text>
          <Content>Schneller Speicher</Content>
        </RadioButton>
      </RadioGroup>
    </SkeletonMode>,
  );
  await expect.element(status()).toBeInTheDocument();

  expect(bars()).toEqual(["Speicher"]);
});

test("the buttons inside a field are hidden", async () => {
  await render(
    <SkeletonMode>
      <TextField type="password">
        <Label>Passwort</Label>
      </TextField>
      <NumberField>
        <Label>Anzahl</Label>
      </NumberField>
      <SearchField>
        <Label>Suche</Label>
      </SearchField>
      <ComboBox>
        <Label>Domain</Label>
        <Option>example-domain.de</Option>
      </ComboBox>
      <DatePicker>
        <Label>Startdatum</Label>
      </DatePicker>
      <PasswordCreationField>
        <Label>Passwort</Label>
      </PasswordCreationField>
    </SkeletonMode>,
  );
  await expect.element(status()).toBeInTheDocument();

  const buttons = [...document.querySelectorAll("button")];
  expect(buttons.length).toBeGreaterThanOrEqual(7);
  expect(buttons.map((button) => getComputedStyle(button).visibility)).toEqual(
    buttons.map(() => "hidden"),
  );
});

test("a field error is not rendered", async () => {
  await render(
    <SkeletonMode>
      <TextField isInvalid>
        <Label>Datenbankname</Label>
        <FieldError>Der Name ist bereits vergeben.</FieldError>
      </TextField>
    </SkeletonMode>,
  );
  await expect.element(status()).toBeInTheDocument();

  expect(document.body.textContent).not.toContain("bereits vergeben");
});

test("a nested isEnabled={false} field stays operable", async () => {
  await render(
    <SkeletonMode>
      <SkeletonMode isEnabled={false}>
        <TextField>
          <Label>Datenbankname</Label>
        </TextField>
      </SkeletonMode>
    </SkeletonMode>,
  );
  await expect.element(status()).toBeInTheDocument();

  await userEvent.tab();
  await userEvent.keyboard("wordpress");

  await expect
    .element(page.getByRole("textbox", { name: "Datenbankname" }))
    .toHaveValue("wordpress");
  expect(skeletonRoots()).toHaveLength(0);
});

test("outside SkeletonMode, fields are neither inert nor marked", async () => {
  await render(<>{fields()}</>);
  await expect
    .element(page.getByRole("textbox", { name: "Datenbankname" }))
    .toBeInTheDocument();

  expect(skeletonRoots()).toHaveLength(0);
  expect(document.querySelectorAll("[inert]")).toHaveLength(0);
  expect(bars()).toEqual([]);
});
