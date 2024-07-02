import LabeledValue from "@mittwald/flow-react-components/LabeledValue";
import ColumnLayout from "@mittwald/flow-react-components/ColumnLayout";
import Label from "@mittwald/flow-react-components/Label";
import {
  IconDanger,
  IconFailed,
  IconInfo,
  IconPending,
  IconSucceeded,
  IconSuccess,
  IconWarning,
} from "@mittwald/flow-react-components/Icons";

<ColumnLayout l={[1, 1, 1, 1, 1]} m={[1, 1, 1]} s={[1, 1]}>
  <LabeledValue>
    <Label>Danger</Label>
    <IconDanger />
  </LabeledValue>
  <LabeledValue>
    <Label>Warning</Label>
    <IconWarning />
  </LabeledValue>
  <LabeledValue>
    <Label>Success</Label>
    <IconSuccess />
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
    <Label>Failed</Label>
    <IconFailed />
  </LabeledValue>
  <LabeledValue>
    <Label>Succeeded</Label>
    <IconSucceeded />
  </LabeledValue>
</ColumnLayout>;
