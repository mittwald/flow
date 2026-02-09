import { ProgressBar } from "@mittwald/flow-react-components";

<Row>
  <ProgressBar value={100} status="success">
    Success
  </ProgressBar>
  <ProgressBar value={50} status="info">
    Info
  </ProgressBar>
  <ProgressBar value={70} status="warning">
    Warning
  </ProgressBar>
  <ProgressBar value={90} status="danger">
    Danger
  </ProgressBar>
</Row>;
