import {
  Label,
  ProgressBar,
} from "@mittwald/flow-react-components";

<ProgressBar
  maxValue={1000}
  size="l"
  showMaxValue
  formatOptions={{ style: "unit", unit: "gigabyte" }}
  segments={[
    { value: 280, title: "E-Mails" },
    {
      value: 170,
      title: "Datenbanken",
    },
    {
      value: 110,
      title: "Backups",
    },
  ]}
>
  <Label>Speicher</Label>
</ProgressBar>;
