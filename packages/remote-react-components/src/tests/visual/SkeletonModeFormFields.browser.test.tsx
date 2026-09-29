import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

test.each(testEnvironments)(
  "SkeletonMode input fields (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      SkeletonMode,
      Section,
      ColumnLayout,
      Label,
      Button,
      Option,
      FieldDescription,
      FieldError,
      TextField,
      TextArea,
      NumberField,
      SearchField,
      PasswordCreationField,
      Select,
      ComboBox,
      Autocomplete,
      DatePicker,
      DateRangePicker,
      TimeField,
      FileField,
    },
  }) => {
    await render(
      <SkeletonMode>
        <Section>
          <ColumnLayout m={[1, 1, 1]}>
            <TextField defaultValue="wordpress_prod" isRequired>
              <Label>Datenbankname</Label>
              <FieldDescription>
                Nur Kleinbuchstaben und Unterstriche
              </FieldDescription>
            </TextField>
            <TextField type="password" isInvalid>
              <Label>Bisheriges Passwort</Label>
              <FieldError>Das Passwort ist falsch.</FieldError>
            </TextField>
            <PasswordCreationField>
              <Label>Neues Passwort</Label>
            </PasswordCreationField>
            <Select defaultValue="8.4">
              <Label>MySQL-Version</Label>
              <Option value="8.0">8.0</Option>
              <Option value="8.4">8.4</Option>
            </Select>
            <Select isInvalid>
              <Label>Zeichensatz</Label>
              <Option value="utf8mb4">utf8mb4</Option>
            </Select>
            <NumberField defaultValue={2}>
              <Label>Anzahl Benutzer</Label>
            </NumberField>
            <ComboBox>
              <Label>Projekt</Label>
              <Option>Webshop Relaunch</Option>
            </ComboBox>
            <Autocomplete>
              <SearchField isDisabled>
                <Label>Server</Label>
              </SearchField>
              <Option>p-4711</Option>
            </Autocomplete>
            <FileField>
              <Label>Import</Label>
              <Button variant="outline" color="secondary">
                Datei auswählen
              </Button>
              <FieldDescription>SQL-Dump, höchstens 2 GB</FieldDescription>
            </FileField>
            <DatePicker>
              <Label>Erstes Backup</Label>
            </DatePicker>
            <TimeField>
              <Label>Uhrzeit</Label>
            </TimeField>
            <DateRangePicker>
              <Label>Aufbewahrung</Label>
            </DateRangePicker>
          </ColumnLayout>
          <TextArea rows={3}>
            <Label>Beschreibung</Label>
          </TextArea>
          <SkeletonMode isEnabled={false}>
            <TextField defaultValue="db-4711.mysql.example-domain.de">
              <Label>Host</Label>
            </TextField>
          </SkeletonMode>
        </Section>
      </SkeletonMode>,
    );

    await testScreenshot("SkeletonMode input fields");
  },
);

test.each(testEnvironments)(
  "SkeletonMode choice fields (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      SkeletonMode,
      Section,
      ColumnLayout,
      Label,
      Text,
      Content,
      Slider,
      SegmentedControl,
      Segment,
      Checkbox,
      CheckboxGroup,
      CheckboxButton,
      RadioGroup,
      Radio,
      RadioButton,
      Switch,
    },
  }) => {
    await render(
      <SkeletonMode>
        <Section>
          <ColumnLayout m={[1, 1]}>
            <Slider defaultValue={20} minValue={5} maxValue={100}>
              <Label>Speicherplatz in GB</Label>
            </Slider>
            <SegmentedControl defaultValue="daily">
              <Label>Backup-Intervall</Label>
              <Segment value="daily">Täglich</Segment>
              <Segment value="weekly">Wöchentlich</Segment>
            </SegmentedControl>
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
          <CheckboxButton defaultSelected isInvalid>
            <Text>Tägliches Backup</Text>
            <Content>Sichert die Datenbank jede Nacht</Content>
          </CheckboxButton>
          <Checkbox defaultSelected>Ich akzeptiere die AGB</Checkbox>
          <Switch defaultSelected>Fernzugriff erlauben</Switch>
          <SkeletonMode isEnabled={false}>
            <Switch>Wartungsmodus</Switch>
          </SkeletonMode>
        </Section>
      </SkeletonMode>,
    );

    await testScreenshot("SkeletonMode choice fields");
  },
);
