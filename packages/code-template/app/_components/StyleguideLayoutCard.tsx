import type { FC } from "react";
import Heading from "@mittwald/flow-react-components/Heading";
import LayoutCard from "@mittwald/flow-react-components/LayoutCard";
import Section from "@mittwald/flow-react-components/Section";
import Text from "@mittwald/flow-react-components/Text";
import Link from "@mittwald/flow-react-components/Link";

export const StyleguideLayoutCard: FC = () => {
  return (
    <LayoutCard>
      <Section>
        <Heading>Lerne mehr über Flow</Heading>
        <Text>
          Nutze unseren Styleguide, um mehr über das Design System Flow zu
          erfahren und konsistente Benutzeroberflächen zu entwickeln.
        </Text>
        <Link href="https://mittwald.github.io/flow">Zum Styleguide</Link>
      </Section>
    </LayoutCard>
  );
};
