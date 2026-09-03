import {
  Label,
  ProgressBar,
} from "@mittwald/flow-react-components";

<>
  <ProgressBar value={100} status="success">
    <Label>Success</Label>
  </ProgressBar>
  <ProgressBar value={50} status="info">
    <Label>Info</Label>
  </ProgressBar>
  <ProgressBar value={70} status="warning">
    <Label>Warning</Label>
  </ProgressBar>
  <ProgressBar value={90} status="danger">
    <Label>Danger</Label>
  </ProgressBar>
</>;
