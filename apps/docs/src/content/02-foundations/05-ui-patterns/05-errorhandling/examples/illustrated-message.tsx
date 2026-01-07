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
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { AsyncContent } from "@/content/02-foundations/05-ui-patterns/05-errorhandling/examples/components/AsyncContent";

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
          <ErrorBoundary
            errorComponent={() => (
              <IllustratedMessage color="danger">
                <IconDanger />
                <Heading>
                  Fehler beim Laden von Daten
                </Heading>
                <Text>
                  Dieser Bereich konnte nicht geladen
                  werden. Wir arbeiten daran das Problem zu
                  beheben. Bitte habe etwas Geduld und
                  probiere es später noch einmal.
                </Text>
              </IllustratedMessage>
            )}
          >
            <AsyncContent />
          </ErrorBoundary>
        </Suspense>
      </LayoutCard>
    </Flex>
  );
};
