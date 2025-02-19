import {
  ColumnLayout,
  Content,
  CopyButton,
  IconExternalLink,
  InlineCode,
  Label,
  LabeledValue,
  Link,
  Text,
} from "@mittwald/flow-react-components";

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
