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
    { color: "violet", value: 280, title: "E-Mails" },
    {
      color: "sea-green",
      value: 150,
      title: "Datenbanken",
    },
    {
      color: "magenta",
      value: 150,
      title: "Backups",
    },
  ]}
>
  <Label>Speicher</Label>
</ProgressBar>;
