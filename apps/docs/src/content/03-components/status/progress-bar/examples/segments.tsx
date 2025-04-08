import {
  Label,
  ProgressBar,
} from "@mittwald/flow-react-components";

<ProgressBar
  value={500}
  maxValue={1000}
  size="l"
  formatOptions={{ style: "unit", unit: "gigabyte" }}
  segments={[
    { value: 280, title: "E-Mails" },
    {
      value: 150,
      title: "Datenbanken",
    },
    {
      value: 150,
      title: "Backups",
    },
  ]}
>
  <Label>Speicher</Label>
</ProgressBar>;
