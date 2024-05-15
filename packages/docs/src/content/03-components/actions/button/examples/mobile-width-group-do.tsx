import Button from "@mittwald/flow-react-components/Button";
import Section from "@mittwald/flow-react-components/Section";
import TextField from "@mittwald/flow-react-components/TextField";
import Label from "@mittwald/flow-react-components/Label";

<Section>
  <TextField>
    <Label>Projekt Name</Label>
  </TextField>
  <div
    style={{
      flexDirection: "column",
      display: "flex",
      rowGap: "16px",
      alignItems: "stretch",
      backgroundColor: "#f8f8f8",
      marginInline: "-32px",
      marginBottom: "-32px",
      padding: "16px 32px 32px",
      borderTop: "1px solid #e6e6e6",
    }}
  >
    <Button style={{ width: "100%" }}>Weiter</Button>
    <Button
      style={{ width: "100%" }}
      variant="soft"
      color="secondary"
    >
      Abbrechen
    </Button>
  </div>
</Section>;
