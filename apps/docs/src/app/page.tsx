"use client";
import {
  AccentBox,
  Color,
  ColumnLayout,
  Flex,
  Heading,
  IconCode,
  IconExtension,
  Image,
  LayoutCard,
  Link,
  Section,
  Text,
} from "@mittwald/flow-react-components";
import type { FC } from "react";
import { FlowLogo } from "@/app/_components/layout/Header/FlowLogo";
import flow10Tile from "../../public/assets/flow-1-0-tile.png";
import developerTile from "../../public/assets/developer-tile.png";
import extensionsTile from "../../public/assets/extensions-tile.webp";
import { ComposingCodeExample } from "@/app/_components/ComposingCodeExample";
import styles from "./page.module.scss";

const Home: FC = () => {
  return (
    <Flex direction="column" className={styles.wrapper} align="center">
      <Flex
        direction="column"
        align="center"
        padding="xl"
        gap="l"
        className={styles.top}
      >
        <FlowLogo aria-hidden className={styles.logo} />
        <Heading level={1}>mStudio Design System</Heading>
      </Flex>

      <ColumnLayout s={[1]} l={[1, 1]} gap="xl">
        <LayoutCard>
          <AccentBox color="dark">
            <Section>
              <Heading>Im Design System starten</Heading>
              <Text>
                Konsistente Components und Patterns im Einklang mit der Marke
                fördern nutzerzentriertes, barrierearmes Design und sorgen für
                eine starke Developer Experience.
              </Text>
              <Link href="/get-started/installation">Zu Get Started</Link>
            </Section>
          </AccentBox>
        </LayoutCard>
        <LayoutCard>
          <AccentBox
            backgroundImage={flow10Tile.src}
            color="light-static"
            className={styles.releaseTile}
          >
            <Section className={styles.releaseContent}>
              <Heading>Flow 1.0 ist da</Heading>
              <Text>
                Eine kleine Zahl, ein großer Schritt. Flow 1.0 macht unser
                Design System versioniert, stabil und verlässlich.
              </Text>
              <Link href="/releases">Zu Releases</Link>
            </Section>
          </AccentBox>
        </LayoutCard>
      </ColumnLayout>

      <LayoutCard>
        <ColumnLayout l={[1]} m={[1]} s={[1]} gap="xl">
          <Section>
            <Heading>Fokus auf Developer Experience</Heading>
            <Text>
              Verschachtelte Components erleichtern das Einfügen.
              Automatisierungen ordnen Components automatisch mit passenden
              Abständen an und verhindern Abweichungen vom Design System. Alles
              Open Source auf{" "}
              <Link href="https://github.com/mittwald/flow" target="_blank">
                GitHub
              </Link>{" "}
              verfügbar und hier im Styleguide dokumentiert.
            </Text>
            <Link href="/components/actions/action-group">
              Zu den Components
            </Link>
          </Section>
          <ComposingCodeExample />
        </ColumnLayout>
      </LayoutCard>

      <ColumnLayout l={[1, 1]} gap="xl" s={[1]}>
        <LayoutCard>
          <AccentBox
            backgroundColor="violet"
            color="dark"
            className={styles.imageTile}
          >
            <ColumnLayout m={[1, 1]}>
              <Section>
                <Heading>mittwald Developer Portal</Heading>
                <Text>
                  Im Developer Portal findest du alles, um direkt loszulegen:
                  klare API-Dokumentation, praktische CLI-Guides und alle Infos,
                  die du brauchst, um eigene Extensions zu entwickeln.
                </Text>
                <Link href="https://developer.mittwald.de" target="_blank">
                  Zum Developer-Portal
                </Link>
              </Section>
              <div className={styles.imageContainer}>
                <Image src={developerTile.src} />
              </div>
              <Color color="light-static" className={styles.imageTileIcon}>
                <IconCode size="l" aria-hidden />
              </Color>
            </ColumnLayout>
          </AccentBox>
        </LayoutCard>
        <LayoutCard>
          <AccentBox
            backgroundColor="navy"
            color="dark"
            className={styles.imageTile}
          >
            <ColumnLayout m={[1, 1]}>
              <Section>
                <Heading>Baue mStudio Extensions</Heading>
                <Text>
                  Mit Flow entwickelst du mühelos die Benutzeroberflächen im
                  passenden Stil. Ganz gleich, ob direkt in mStudio integriert
                  oder als eigenständige Lösung.
                </Text>
                <Link
                  href="https://www.mittwald.de/mstudio/extensions"
                  target="_blank"
                >
                  Zur Extension Landingpage
                </Link>
              </Section>
              <div className={styles.imageContainer}>
                <Image src={extensionsTile.src} />
              </div>
              <Color color="dark-static" className={styles.imageTileIcon}>
                <IconExtension size="l" aria-hidden />
              </Color>
            </ColumnLayout>
          </AccentBox>
        </LayoutCard>
      </ColumnLayout>

      <ColumnLayout l={[1, 1, 1]} gap="xl">
        <LayoutCard>
          <Section>
            <Heading>Foundations</Heading>
            <Text>
              Erfahre mehr über die Grundlagen unseres Design Systems.
            </Text>
            <Link href="/foundations/design/design-tokens">
              Zu den Foundations
            </Link>
          </Section>
        </LayoutCard>
        <LayoutCard>
          <Section>
            <Heading>Patterns</Heading>
            <Text>
              Finde passende Pattern für häufige Design- und
              Interaktionsaufgaben.
            </Text>
            <Link href="/patterns/patterns/anlegeprozess">Zu den Patterns</Link>
          </Section>
        </LayoutCard>
        <LayoutCard>
          <Section>
            <Heading>Components</Heading>
            <Text>
              Nutze unseren modularen Components-Baukasten für dein Projekt.
            </Text>
            <Link href="/components/actions/action-group">
              Zu den Components
            </Link>
          </Section>
        </LayoutCard>
      </ColumnLayout>
    </Flex>
  );
};

export default Home;
