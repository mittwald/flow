"use client";
import {
  Button,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  ColumnLayout,
  ComboBox,
  Content,
  DatePicker,
  FieldDescription,
  FieldError,
  FileField,
  Heading,
  Label,
  NumberField,
  Option,
  Radio,
  RadioGroup,
  SearchField,
  Section,
  Select,
  Slider,
  Switch,
  Text,
  TextArea,
  TextField,
  TimeField,
} from "@mittwald/flow-remote-react-components";

export default function FormFieldsDemo() {
  return (
    <Section>
      <Heading>Datenbank anlegen</Heading>
      <ColumnLayout m={[1, 1]}>
        <TextField defaultValue="wordpress_prod" isRequired>
          <Label>Datenbankname</Label>
          <FieldDescription>
            Nur Kleinbuchstaben und Unterstriche
          </FieldDescription>
        </TextField>
        <Select defaultValue="8.4" isInvalid>
          <Label>MySQL-Version</Label>
          <Option value="8.0">8.0</Option>
          <Option value="8.4">8.4</Option>
          <FieldError>Die Version ist nicht verfügbar.</FieldError>
        </Select>
        <NumberField defaultValue={2}>
          <Label>Anzahl Benutzer</Label>
        </NumberField>
        <ComboBox>
          <Label>Projekt</Label>
          <Option>Webshop Relaunch</Option>
        </ComboBox>
        <SearchField>
          <Label>Server</Label>
        </SearchField>
        <FileField>
          <Label>Import</Label>
          <Button variant="outline" color="secondary">
            Datei auswählen
          </Button>
        </FileField>
        <DatePicker>
          <Label>Erstes Backup</Label>
        </DatePicker>
        <TimeField>
          <Label>Uhrzeit</Label>
        </TimeField>
      </ColumnLayout>
      <TextArea>
        <Label>Beschreibung</Label>
      </TextArea>
      <Slider defaultValue={20} minValue={5} maxValue={100}>
        <Label>Speicherplatz in GB</Label>
      </Slider>
      <ColumnLayout m={[1, 1]}>
        <RadioGroup defaultValue="utf8mb4">
          <Label>Kollation</Label>
          <Radio value="utf8mb4">utf8mb4_unicode_ci</Radio>
          <Radio value="latin1">latin1_swedish_ci</Radio>
        </RadioGroup>
        <CheckboxGroup defaultValue={["mail"]}>
          <Label>Benachrichtigungen</Label>
          <Checkbox value="mail">Per E-Mail</Checkbox>
          <Checkbox value="sms">Per SMS</Checkbox>
        </CheckboxGroup>
      </ColumnLayout>
      <CheckboxButton defaultSelected>
        <Text>Tägliches Backup</Text>
        <Content>Sichert die Datenbank jede Nacht</Content>
      </CheckboxButton>
      <Switch defaultSelected>Fernzugriff erlauben</Switch>
    </Section>
  );
}
