import type { Meta, StoryObj } from "@storybook/react";
import SkeletonMode from "../SkeletonMode";
import { Section } from "@/components/Section";
import { Heading } from "@/components/Heading";
import { ColumnLayout } from "@/components/ColumnLayout";
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

const meta: Meta<typeof SkeletonMode> = {
  title: "Content/SkeletonMode/FormFields",
  component: SkeletonMode,
  args: {
    isEnabled: true,
  },
  render: (props) => (
    <SkeletonMode {...props}>
      <Section>
        <Heading>Datenbank anlegen</Heading>
        <ColumnLayout m={[1, 1]}>
          <TextField defaultValue="wordpress_prod" isRequired>
            <Label>Datenbankname</Label>
            <FieldDescription>
              Nur Kleinbuchstaben und Unterstriche
            </FieldDescription>
          </TextField>
          <Select defaultValue="8.4">
            <Label>MySQL-Version</Label>
            <Option value="8.0">8.0</Option>
            <Option value="8.4">8.4</Option>
          </Select>
          <PasswordCreationField>
            <Label>Passwort</Label>
          </PasswordCreationField>
          <NumberField defaultValue={2}>
            <Label>Anzahl Benutzer</Label>
          </NumberField>
          <ComboBox>
            <Label>Projekt</Label>
            <Option>Webshop Relaunch</Option>
          </ComboBox>
          <Autocomplete>
            <SearchField>
              <Label>Server</Label>
            </SearchField>
            <Option>p-4711</Option>
          </Autocomplete>
          <DatePicker>
            <Label>Erstes Backup</Label>
          </DatePicker>
          <TimeField>
            <Label>Uhrzeit</Label>
          </TimeField>
          <DateRangePicker>
            <Label>Aufbewahrung</Label>
          </DateRangePicker>
          <FileField>
            <Label>Import</Label>
            <Button variant="outline" color="secondary">
              Datei auswählen
            </Button>
            <FieldDescription>SQL-Dump, höchstens 2 GB</FieldDescription>
          </FileField>
        </ColumnLayout>
        <TextArea>
          <Label>Beschreibung</Label>
        </TextArea>
        <Slider defaultValue={20} minValue={5} maxValue={100}>
          <Label>Speicherplatz in GB</Label>
        </Slider>
        <SegmentedControl defaultValue="daily">
          <Label>Backup-Intervall</Label>
          <Segment value="daily">Täglich</Segment>
          <Segment value="weekly">Wöchentlich</Segment>
        </SegmentedControl>
        <RadioGroup defaultValue="utf8mb4">
          <Label>Zeichensatz</Label>
          <Radio value="utf8mb4">utf8mb4</Radio>
          <Radio value="latin1">latin1</Radio>
        </RadioGroup>
        <RadioGroup defaultValue="ssd" m={[1, 1]}>
          <Label>Speichertyp</Label>
          <RadioButton value="ssd">
            <Text>SSD</Text>
            <Content>Für Shops und Datenbanken</Content>
          </RadioButton>
          <RadioButton value="hdd">
            <Text>HDD</Text>
            <Content>Für Archive</Content>
          </RadioButton>
        </RadioGroup>
        <CheckboxGroup defaultValue={["mail"]}>
          <Label>Benachrichtigungen</Label>
          <Checkbox value="mail">Per E-Mail</Checkbox>
          <Checkbox value="sms">Per SMS</Checkbox>
        </CheckboxGroup>
        <CheckboxButton>
          <Text>Tägliches Backup</Text>
          <Content>Sichert die Datenbank jede Nacht</Content>
        </CheckboxButton>
        <Checkbox defaultSelected>Ich akzeptiere die AGB</Checkbox>
        <Switch defaultSelected>Fernzugriff erlauben</Switch>
      </Section>
    </SkeletonMode>
  ),
};

export default meta;

type Story = StoryObj<typeof SkeletonMode>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    isEnabled: false,
  },
};

export const WithFieldError: Story = {
  render: (props) => (
    <SkeletonMode {...props}>
      <TextField isInvalid defaultValue="wordpress-prod">
        <Label>Datenbankname</Label>
        <FieldError>
          Nur Kleinbuchstaben und Unterstriche sind erlaubt.
        </FieldError>
      </TextField>
    </SkeletonMode>
  ),
};
