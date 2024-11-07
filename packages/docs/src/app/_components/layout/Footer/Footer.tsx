"use client";
import type { FC } from "react";
import { LayoutCard } from "@mittwald/flow-react-components/LayoutCard";
import { ColumnLayout } from "@mittwald/flow-react-components/ColumnLayout";
import { Section } from "@mittwald/flow-react-components/Section";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { Header } from "@mittwald/flow-react-components/Header";
import { Link } from "@mittwald/flow-react-components/Link";

export const Footer: FC = () => {
  const bildschirmGROSS = true;

  return (
    <footer>
      <LayoutCard>
        <ColumnLayout m={[1, 1, 2]} l={[1, 1, 3]}>
          <Section>
            <Header>
              <Heading level={3}>Contributoren-Seiten</Heading>
            </Header>
            <Link href="https://github.com/mittwald/flow">GitHub Repo</Link>
            <Link href="https://developer.mittwald.de/">Developer-Portal</Link>
          </Section>
          <Section>
            <Header>
              <Heading level={3}>Rechtliches</Heading>
            </Header>
            <Link href="https://www.mittwald.de/impressum">Impressum</Link>
            <Link href="https://www.mittwald.de/datenschutz">Datenschutz</Link>
          </Section>
          <>
            <ColumnLayout m={[1, 1]}>
              <Section>
                <Heading level={3}>
                  Hilf uns, Flow noch besser zu machen!
                </Heading>
                Fehlt dir eine bestimmte Component oder etwas Anderes? Hast du
                Feedback? Dann teile es uns gerne auf GitHub mit.
                <Link href="#">Feedback zu Flow geben</Link>
              </Section>
              {bildschirmGROSS && <div>Hier kommt Bild und so</div>}
            </ColumnLayout>
          </>
        </ColumnLayout>
      </LayoutCard>
    </footer>
  );
};
