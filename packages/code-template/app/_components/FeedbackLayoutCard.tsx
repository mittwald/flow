import type { FC } from "react";
import Heading from "@mittwald/flow-react-components/Heading";
import LayoutCard from "@mittwald/flow-react-components/LayoutCard";
import Section from "@mittwald/flow-react-components/Section";
import Text from "@mittwald/flow-react-components/Text";
import Link from "@mittwald/flow-react-components/Link";

export const FeedbackLayoutCard: FC = () => {
  return (
    <LayoutCard>
      <Section>
        <Heading>Gib uns Feedback</Heading>
        <Text>Wir freuen uns auf deine Anmerkungen und Wünsche zu Flow.</Text>
        <Link href="https://github.com/mittwald/flow/issues/new">
          Zum GitHub Repository
        </Link>
      </Section>
    </LayoutCard>
  );
};
