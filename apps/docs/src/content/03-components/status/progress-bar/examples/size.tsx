import {
  Label,
  ProgressBar,
} from "@mittwald/flow-react-components";
import { Column } from "@/lib/liveCode/components/LiveCodeEditor/components";

<Column>
  <ProgressBar size="s" value={50}>
    <Label>Größe S</Label>
  </ProgressBar>
  <ProgressBar size="m" value={50}>
    <Label>Größe M</Label>
  </ProgressBar>
  <ProgressBar size="l" value={50}>
    <Label>Größe L</Label>
  </ProgressBar>
</Column>;
