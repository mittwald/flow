import LabeledValue from "@mittwald/flow-react-components/LabeledValue";
import Label from "@mittwald/flow-react-components/Label";
import Content from "@mittwald/flow-react-components/Content";
import CopyButton from "@mittwald/flow-react-components/CopyButton";
import Link from "@mittwald/flow-react-components/Link";
import Text from "@mittwald/flow-react-components/Text";
import { IconExternalLink } from "@mittwald/flow-react-components/Icons";
import ColumnLayout from "@mittwald/flow-react-components/ColumnLayout";
import InlineCode from "@mittwald/flow-react-components/InlineCode";

<ColumnLayout>
  <LabeledValue>
    <Label>Projektname</Label>
    <Content>Dolce Vita</Content>
  </LabeledValue>

  <LabeledValue>
    <Label>Short-ID</Label>
    <Content>p-wut3uw</Content>
    <CopyButton text="p-wut3uw" />
  </LabeledValue>

  <LabeledValue>
    <Label>Projektdomain</Label>
    <Link>
      <Text>p-lol3qe.project.space</Text>
      <IconExternalLink />
    </Link>
    <CopyButton text="p-lol3qe.project.space" />
  </LabeledValue>

  <LabeledValue>
    <Label>Server</Label>
    <Link>Dolce-Server-01</Link>
  </LabeledValue>

  <LabeledValue>
    <Label>A-Record</Label>
    <InlineCode>45.144.187.21</InlineCode>
    <CopyButton text="45.144.187.21" />
  </LabeledValue>

  <LabeledValue>
    <Label>Erstellungsdatum</Label>
    <Content>06.12.2023 um 11:40 Uhr</Content>
  </LabeledValue>
</ColumnLayout>;
