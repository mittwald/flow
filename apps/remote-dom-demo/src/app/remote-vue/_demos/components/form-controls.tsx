/** @jsxImportSource @/app/remote-vue/_lib */
import {
  Autocomplete,
  Button,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  CodeEditor,
  ComboBox,
  DatePicker,
  DateRangePicker,
  FieldDescription,
  FileField,
  Heading,
  Icon,
  Label,
  MarkdownEditor,
  NumberField,
  Option,
  PasswordCreationField,
  Radio,
  RadioGroup,
  Rating,
  RatingSegment,
  SearchField,
  Section,
  Segment,
  SegmentedControl,
  Select,
  Slider,
  Switch,
  Text,
  TextArea,
  TextField,
  TimeField,
} from "@mittwald/flow-remote-vue-components";
import { ComponentGroupPage } from "@/app/remote-vue/_demos/components/lib/ComponentGroupPage";
import {
  iconMoodEmpty,
  iconMoodEmptyFilled,
  iconMoodHappy,
  iconMoodHappyFilled,
  iconMoodSad,
  iconMoodSadFilled,
} from "@/app/remote-vue/_demos/lib/icons";
import { defineComponent, ref } from "vue";

/*
 * Runs inside the extension: the host serializes the dropped, pasted or picked
 * File across the connection and awaits what this returns. The size goes into
 * the link text to show the file arrived whole, not just its name.
 */
const uploadFile = async (file: File) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    url: "https://flow.mittwald.de/assets/mittwald_logo_rgb.jpg",
    name: `${file.name} (${file.size} bytes)`,
  };
};

/** The Vue counterpart of `/remote/components/form-controls`. */
export const FormControlsDemo = defineComponent({
  name: "FormControlsDemo",
  setup() {
    const password = ref("");
    const holocrons = ref<string>();

    return () => (
      <ComponentGroupPage title="Form Controls">
        <Section>
          <Heading level={3}>Autocomplete</Heading>
          <Autocomplete>
            <TextField>
              <Label>Homeworld</Label>
            </TextField>
            <Option value="Tatooine">Tatooine</Option>
            <Option value="Alderaan">Alderaan</Option>
            <Option value="Hoth">Hoth</Option>
          </Autocomplete>
        </Section>

        <Section>
          <Heading level={3}>Checkbox</Heading>
          <Checkbox>Ready for launch</Checkbox>
        </Section>

        <Section>
          <Heading level={3}>CheckboxButton</Heading>
          <CheckboxButton>
            I accept the Rebel Alliance code of conduct.
          </CheckboxButton>
        </Section>

        <Section>
          <Heading level={3}>CheckboxGroup</Heading>
          <CheckboxGroup defaultValue={["archives"]}>
            <Label>Clearance</Label>
            <Checkbox value="archives">Jedi Archives</Checkbox>
            <Checkbox value="command">Command deck</Checkbox>
          </CheckboxGroup>
        </Section>

        <Section>
          <Heading level={3}>CodeEditor</Heading>
          <CodeEditor
            language="tsx"
            defaultValue="const hyperdriveClass = 1.0;"
          >
            <Label>Navicomputer script</Label>
          </CodeEditor>
        </Section>

        <Section>
          <Heading level={3}>ComboBox</Heading>
          <ComboBox>
            <Label>Starship</Label>
            <Option>Millennium Falcon</Option>
            <Option>X-wing</Option>
            <Option>Y-wing</Option>
          </ComboBox>
        </Section>

        <Section>
          <Heading level={3}>DatePicker</Heading>
          <DatePicker>
            <Label>Launch date</Label>
          </DatePicker>
        </Section>

        <Section>
          <Heading level={3}>DateRangePicker</Heading>
          <DateRangePicker>
            <Label>Mission period</Label>
          </DateRangePicker>
        </Section>

        <Section>
          <Heading level={3}>FileField</Heading>
          <FileField
            multiple
            onChange={(files: FileList | null) =>
              (holocrons.value = files
                ? Array.from(files)
                    .map((file) => `${file.name} (${file.size} B)`)
                    .join(", ")
                : undefined)
            }
          >
            <Label>Holocrons</Label>
            <Button variant="outline" color="secondary">
              Choose
            </Button>
          </FileField>
          <Text>Chosen: {holocrons.value ?? "–"}</Text>
        </Section>

        <Section>
          <Heading level={3}>MarkdownEditor</Heading>
          <MarkdownEditor accept="image/*" uploadFile={uploadFile}>
            <Label>Mission report</Label>
          </MarkdownEditor>
        </Section>

        <Section>
          <Heading level={3}>NumberField</Heading>
          <NumberField unit="MiB" defaultValue={512}>
            <Label>Droid memory</Label>
          </NumberField>
        </Section>

        <Section>
          <Heading level={3}>PasswordCreationField</Heading>
          <PasswordCreationField
            value={password.value}
            onChange={(value: string) => (password.value = value)}
          >
            <Label>Launch code</Label>
          </PasswordCreationField>
        </Section>

        <Section>
          <Heading level={3}>RadioGroup</Heading>
          <RadioGroup defaultValue="commander">
            <Label>Rank</Label>
            <Radio value="commander">Commander</Radio>
            <Radio value="pilot">Pilot</Radio>
            <Radio value="engineer">Engineer</Radio>
          </RadioGroup>
        </Section>

        <Section>
          <Heading level={3}>Rating</Heading>
          {/* `iconEmpty` and `iconFilled` are slots, so a whole subtree crosses
              the boundary. Tabler is React-only; these are its paths. */}
          <Rating fill="single" defaultValue={2}>
            <Label>How was your meal at the cantina?</Label>
            <RatingSegment aria-label="Terrible">
              {{
                iconEmpty: () => <Icon>{iconMoodSad()}</Icon>,
                iconFilled: () => (
                  <Icon color="danger">{iconMoodSadFilled()}</Icon>
                ),
              }}
            </RatingSegment>
            <RatingSegment aria-label="Okay">
              {{
                iconEmpty: () => <Icon>{iconMoodEmpty()}</Icon>,
                iconFilled: () => (
                  <Icon color="warning">{iconMoodEmptyFilled()}</Icon>
                ),
              }}
            </RatingSegment>
            <RatingSegment aria-label="Great">
              {{
                iconEmpty: () => <Icon>{iconMoodHappy()}</Icon>,
                iconFilled: () => (
                  <Icon color="success">{iconMoodHappyFilled()}</Icon>
                ),
              }}
            </RatingSegment>
          </Rating>
        </Section>

        <Section>
          <Heading level={3}>SearchField</Heading>
          <SearchField>
            <Label>Search the fleet</Label>
          </SearchField>
        </Section>

        <Section>
          <Heading level={3}>SegmentedControl</Heading>
          <SegmentedControl defaultValue="light">
            <Label>Speed</Label>
            <Segment value="sublight">Sublight</Segment>
            <Segment value="light">Lightspeed</Segment>
          </SegmentedControl>
        </Section>

        <Section>
          <Heading level={3}>Select</Heading>
          <Select>
            <Label>Homeworld</Label>
            <Option value="Tatooine">Tatooine</Option>
            <Option value="Alderaan">Alderaan</Option>
            <Option value="Hoth">Hoth</Option>
          </Select>
        </Section>

        <Section>
          <Heading level={3}>Slider</Heading>
          <Slider
            formatOptions={{ style: "unit", unit: "kilometer-per-hour" }}
            minValue={0}
            maxValue={1200}
            defaultValue={1050}
            step={50}
            showInitialMarker
          >
            <Label>Maximum speed</Label>
          </Slider>
        </Section>

        <Section>
          <Heading level={3}>Switch</Heading>
          <Switch defaultSelected>Deflector shields</Switch>
        </Section>

        <Section>
          <Heading level={3}>TextArea</Heading>
          <TextArea>
            <Label>Distress message</Label>
            <FieldDescription>
              Keep it short, the droid is waiting.
            </FieldDescription>
          </TextArea>
        </Section>

        <Section>
          <Heading level={3}>TextField</Heading>
          <TextField isRequired>
            <Label>Call sign</Label>
          </TextField>
        </Section>

        <Section>
          <Heading level={3}>TimeField</Heading>
          <TimeField>
            <Label>Launch time</Label>
          </TimeField>
        </Section>
      </ComponentGroupPage>
    );
  },
});
