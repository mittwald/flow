import {
  AccentBox,
  Heading,
  LayoutCard,
  Section,
  Text,
} from "@mittwald/flow-react-components";

<>
  <LayoutCard>
    <AccentBox
      color="dark-static"
      backgroundColor="#f6dfff"
    >
      <Section>
        <Heading>Nicht Static</Heading>
        <Text>Die Farben passen sich an das Theme an.</Text>
      </Section>
    </AccentBox>
  </LayoutCard>
  <LayoutCard>
    <AccentBox
      backgroundImage="https://mittwald.github.io/flow/_next/static/media/darkmode-bg.174mob-24zj3j.png"
      color="light-static"
    >
      <Section>
        <Heading>Static</Heading>
        <Text>
          Die Farben bleiben in Dark und Light Theme gleich.
        </Text>
      </Section>
    </AccentBox>
  </LayoutCard>
</>;
