import {
  Heading,
  Label,
  LayoutCard,
  Section,
  TextField,
} from "@mittwald/flow-react-components";

<LayoutCard>
  <Section>
    <Heading>Projekt bearbeiten</Heading>
    <TextField defaultValue="Mein Projekt">
      <Label>Projektname</Label>
    </TextField>
    <TextField
      isReadOnly
      defaultValue="mein-projekt.example.com"
    >
      <Label>Domain</Label>
    </TextField>
  </Section>
</LayoutCard>;
