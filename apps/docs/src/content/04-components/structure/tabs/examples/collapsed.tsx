import {
  Heading,
  LayoutCard,
  Section,
  Tab,
  Tabs,
  TabTitle,
} from "@mittwald/flow-react-components";

<LayoutCard style={{ maxWidth: "320px" }}>
  <Section>
    <Heading>SSH-Benutzer</Heading>
    <Tabs>
      <Tab>
        <TabTitle>Mit App verbinden</TabTitle>
        App Content
      </Tab>
      <Tab>
        <TabTitle>Mit Container verbinden</TabTitle>
        Container Content
      </Tab>
    </Tabs>
  </Section>
</LayoutCard>;
