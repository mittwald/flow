import {
  AccentBox,
  Heading,
  LayoutCard,
  Section,
  Text,
} from "@mittwald/flow-react-components";

<>
  <LayoutCard>
    <AccentBox color="dark">
      <Section>
        <Heading>Dark</Heading>
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing
          elit.
        </Text>
      </Section>
    </AccentBox>
  </LayoutCard>
  <LayoutCard>
    <AccentBox
      backgroundColor="var(--neutral--color--900)"
      color="light"
    >
      <Section>
        <Heading>Light Static</Heading>
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing
          elit.
        </Text>
      </Section>
    </AccentBox>
  </LayoutCard>
</>;
