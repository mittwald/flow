import {
  Heading,
  Label,
  LayoutCard,
  Section,
  TextField,
} from "@mittwald/flow-react-components";

<LayoutCard>
  <Section>
    <Heading>Vorschau</Heading>
    <TextField isReadOnly defaultValue="Mein Projekt">
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
