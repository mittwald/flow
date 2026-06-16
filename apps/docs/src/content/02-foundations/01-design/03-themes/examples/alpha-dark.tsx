import {
  AccentBox,
  Heading,
  LayoutCard,
  Section,
  Text,
} from "@mittwald/flow-react-components";

<>
  <LayoutCard>
    <AccentBox color="light" backgroundColor="#003FB8">
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
