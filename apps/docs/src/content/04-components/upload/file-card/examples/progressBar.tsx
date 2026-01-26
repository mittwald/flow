import {
  FileCard,
  Label,
  ProgressBar,
} from "@mittwald/flow-react-components";

<FileCard>
  <ProgressBar
    value={2.1}
    maxValue={3.4}
    minValue={0}
    showMaxValue
    formatOptions={{ style: "unit", unit: "megabyte" }}
  >
    <Label>Image.png</Label>
  </ProgressBar>
</FileCard>;
