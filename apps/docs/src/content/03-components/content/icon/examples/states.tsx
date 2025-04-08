import {
  ColumnLayout,
  IconDanger,
  IconFailed,
  IconInfo,
  IconPending,
  IconSucceeded,
  IconSuccess,
  IconWarning,
  Label,
  LabeledValue,
} from "@mittwald/flow-react-components";

<ColumnLayout l={[1, 1, 1, 1, 1]} m={[1, 1, 1]} s={[1, 1]}>
  <LabeledValue>
    <Label>Success</Label>
    <IconSuccess />
  </LabeledValue>
  <LabeledValue>
    <Label>Warning</Label>
    <IconWarning />
  </LabeledValue>
  <LabeledValue>
    <Label>Danger</Label>
    <IconDanger />
  </LabeledValue>
  <LabeledValue>
    <Label>Info</Label>
    <IconInfo />
  </LabeledValue>
  <LabeledValue>
    <Label>Pending</Label>
    <IconPending />
  </LabeledValue>
  <LabeledValue>
    <Label>Succeeded</Label>
    <IconSucceeded />
  </LabeledValue>
  <LabeledValue>
    <Label>Failed</Label>
    <IconFailed />
  </LabeledValue>
</ColumnLayout>;
