import {
  Flex,
  Heading,
  IconDanger,
  IllustratedMessage,
  LayoutCard,
  Section,
  SkeletonText,
  Text,
} from "@mittwald/flow-react-components";
import { Suspense } from "react";

export default () => {
  return (
    <Flex direction="column" gap="m">
      <Heading level={1} color="light">
        Mein Projekt
      </Heading>

      <LayoutCard>
        <Suspense
          fallback={
            <Section>
              <Heading>
                <SkeletonText width={300} />
              </Heading>
              <Text>
                <SkeletonText />
                <SkeletonText />
                <SkeletonText />
              </Text>
            </Section>
          }
        >
          <IllustratedMessage color="danger">
            <IconDanger />
            <Heading>Fehler beim Laden von Daten</Heading>
            <Text>
              Dieser Bereich konnte nicht geladen werden.
              Wir arbeiten daran das Problem zu beheben.
              Bitte habe etwas Geduld und probiere es später
              noch einmal.
            </Text>
          </IllustratedMessage>
        </Suspense>
      </LayoutCard>
    </Flex>
  );
};
