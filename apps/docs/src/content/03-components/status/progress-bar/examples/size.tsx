import {
  Label,
  ProgressBar,
} from "@mittwald/flow-react-components";
import { Column } from "@/lib/liveCode/components/LiveCodeEditor/components";

<Column>
  <ProgressBar size="s" value={50}>
    <Label>Speicher</Label>
  </ProgressBar>
  <ProgressBar size="m" value={50}>
    <Label>Speicher</Label>
  </ProgressBar>
  <ProgressBar size="l" value={50}>
    <Label>Speicher</Label>
  </ProgressBar>
</Column>;
