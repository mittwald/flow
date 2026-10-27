"use client";
import {
  AccentBox,
  Color,
  ColumnLayout,
  Flex,
  Heading,
  IconCode,
  Image,
  LayoutCard,
  Link,
  Section,
  Text,
} from "@mittwald/flow-react-components";
import type { FC, ReactNode } from "react";
import flow10Tile from "../../../public/assets/flow-1-0-tile.webp";
import extensionsTile from "../../../public/assets/extensions-tile.webp";
import heroVisual from "../../../public/assets/home/hero.webp";
import getStartedVisual from "../../../public/assets/home/get-started.webp";
import foundationsVisual from "../../../public/assets/home/foundations.webp";
import componentsVisual from "../../../public/assets/home/components.webp";
import templatesVisual from "../../../public/assets/home/templates.webp";
import factsVisual from "../../../public/assets/home/facts.webp";
import portalVisual from "../../../public/assets/home/portal.webp";
import { ComposingCodeExample } from "@/app/_components/ComposingCodeExample";
import styles from "./page.module.scss";

/** Brand rule: highlight replaces bold. On the dark stages that is white. */
const Highlight: FC<{ children: ReactNode }> = (props) => (
  <Color color="light-static">{props.children}</Color>
);

interface EntryTileProps {
  visual: string;
  title: string;
  href: string;
  linkText: string;
  children: ReactNode;
}

const EntryTile: FC<EntryTileProps> = (props) => (
  <AccentBox
    elementType="article"
    backgroundImage={props.visual}
    color="light-static"
    aspectRatio="3 / 4"
    className={styles.entryTile}
  >
    <Section>
      <Heading level={3} className={styles.tileTitle}>
        {props.title}
      </Heading>
      <Text className={styles.onDarkText}>{props.children}</Text>
      <Link href={props.href}>{props.linkText}</Link>
    </Section>
  </AccentBox>
);

interface FactProps {
  title: string;
  children: ReactNode;
}

const Fact: FC<FactProps> = (props) => (
  <Section>
    <Heading level={3} className={styles.factTitle}>
      {props.title}
    </Heading>
    <Text className={styles.onDarkText}>{props.children}</Text>
  </Section>
);

const Home: FC = () => {
  return (
    <Flex direction="column" className={styles.home}>
      <AccentBox
        elementType="section"
        backgroundImage={heroVisual.src}
        color="light-static"
        className={styles.hero}
      >
        <Flex direction="column" align="center" gap="l">
          <Text className={styles.eyebrow}>mittwald Flow</Text>
          <Heading level={1} className={styles.heroTitle}>
            Das Design System für mStudio
          </Heading>
          <Text elementType="p" className={styles.heroLead}>
            Components, Patterns und Design Tokens für Oberflächen, die sich
            anfühlen wie mStudio –{" "}
            <Highlight>barrierearm, remote-fähig und Open Source.</Highlight>
          </Text>
          <Flex gap="xl" wrap="wrap" justify="center">
            <Link href="/get-started/installation">Jetzt loslegen</Link>
            <Link href="/components/actions/action-group">
              Zu den Components
            </Link>
          </Flex>
        </Flex>
      </AccentBox>

      <ColumnLayout
        l={[1, 1]}
        m={[1]}
        s={[1]}
        gap="l"
        className={styles.teasers}
      >
        <AccentBox
          elementType="article"
          backgroundImage={flow10Tile.src}
          color="light-static"
          className={styles.releaseTeaser}
        >
          <Section className={styles.teaserContent}>
            <Text className={styles.eyebrow}>Releases</Text>
            <Heading className={styles.tileTitle}>Flow 1.0 ist da</Heading>
            <Text>
              Eine kleine Zahl, ein großer Schritt. Flow 1.0 macht unser Design
              System versioniert, stabil und verlässlich.
            </Text>
            <Link href="/releases">Zu Releases</Link>
          </Section>
        </AccentBox>
        <AccentBox
          elementType="article"
          backgroundColor="gradient"
          className={styles.extensionsTeaser}
        >
          <ColumnLayout l={[3, 2]} m={[3, 2]} s={[1, null]} gap="l">
            <Section className={styles.teaserContent}>
              <Text className={styles.eyebrow}>mStudio Extensions</Text>
              <Heading className={styles.tileTitle}>
                Deine Extension im mStudio-Look
              </Heading>
              <Text>
                Mit Flow entwickelst du Oberflächen im passenden Stil – direkt
                in mStudio integriert oder als eigenständige Lösung.
              </Text>
              <Link
                href="https://www.mittwald.de/mstudio/extensions"
                target="_blank"
              >
                Zur Extension Landingpage
              </Link>
            </Section>
            <Image
              src={extensionsTile.src}
              alt=""
              aspectRatio={1}
              withRoundedCorners
              className={styles.teaserPhoto}
            />
          </ColumnLayout>
        </AccentBox>
      </ColumnLayout>

      <div className={styles.dx}>
        <Section className={styles.dxHead}>
          <Text className={styles.eyebrow}>Developer Experience</Text>
          <Heading className={styles.sectionTitle}>
            Components, die sich selbst anordnen
          </Heading>
          <Text className={styles.sectionLead}>
            Verschachtelte Components erleichtern das Einfügen. Flow ordnet sie
            mit passenden Abständen an und verhindert Abweichungen vom Design
            System. Alles Open Source auf{" "}
            <Link
              inline
              href="https://github.com/mittwald/flow"
              target="_blank"
            >
              GitHub
            </Link>
            .
          </Text>
          <Link href="/components/actions/action-group">Zu den Components</Link>
        </Section>
        <LayoutCard className={styles.exampleCard}>
          <ComposingCodeExample />
        </LayoutCard>
      </div>

      <Section>
        <Flex direction="column" align="center" gap="m">
          <Text className={styles.eyebrow}>Styleguide</Text>
          <Heading className={styles.sectionTitle}>
            Alles für deine Oberfläche
          </Heading>
        </Flex>
        <ColumnLayout l={[1, 1, 1, 1]} m={[1, 1]} s={[1]} gap="l">
          <EntryTile
            visual={getStartedVisual.src}
            title="Get Started"
            href="/get-started/installation"
            linkText="Zu Get Started"
          >
            Flow installieren und die erste Oberfläche bauen.
          </EntryTile>
          <EntryTile
            visual={foundationsVisual.src}
            title="Foundations"
            href="/foundations/design/design-tokens"
            linkText="Zu den Foundations"
          >
            Design Tokens, Farben und Grundlagen.
          </EntryTile>
          <EntryTile
            visual={componentsVisual.src}
            title="Components"
            href="/components/actions/action-group"
            linkText="Zu den Components"
          >
            Der modulare Baukasten für dein Projekt.
          </EntryTile>
          <EntryTile
            visual={templatesVisual.src}
            title="Templates"
            href="/templates/app-shells/focus-task"
            linkText="Zu den Templates"
          >
            Vorlagen für häufige Design- und Interaktionsaufgaben.
          </EntryTile>
        </ColumnLayout>
      </Section>

      <AccentBox
        elementType="section"
        backgroundImage={factsVisual.src}
        color="light-static"
        className={styles.facts}
      >
        <ColumnLayout l={[1, 2]} m={[1]} s={[1]} gap="xl">
          <Section>
            <Text className={styles.eyebrow}>Warum Flow</Text>
            <Heading className={styles.sectionTitle}>
              Gebaut für mStudio
            </Heading>
          </Section>
          <ColumnLayout l={[1, 1]} m={[1, 1]} s={[1]} gap="xl">
            <Fact title="Barrierearm">
              Aufgebaut auf <Highlight>React Aria</Highlight> – Tastatur,
              Screenreader und Fokus sind von Anfang an mitgedacht.
            </Fact>
            <Fact title="Remote-fähig">
              mStudio Extensions rendern{" "}
              <Highlight>echte Flow Components</Highlight> im mStudio, aus einem
              abgeschotteten iframe heraus.
            </Fact>
            <Fact title="Hell und dunkel">
              Jedes Design Token gibt es <Highlight>in beiden Themes</Highlight>
              . Deine Oberfläche wechselt mit.
            </Fact>
            <Fact title="Open Source">
              Entwickelt auf GitHub unter <Highlight>MIT-Lizenz</Highlight> –
              Issues und Pull Requests sind willkommen.
            </Fact>
          </ColumnLayout>
        </ColumnLayout>
      </AccentBox>

      <AccentBox
        elementType="article"
        backgroundImage={portalVisual.src}
        color="light-static"
        className={styles.portal}
      >
        <Section className={styles.portalContent}>
          <Text className={styles.eyebrow}>
            <IconCode size="s" aria-hidden /> Für Entwickler*innen
          </Text>
          <Heading className={styles.tileTitle}>
            mittwald Developer Portal
          </Heading>
          <Text className={styles.onDarkText}>
            Klare API-Dokumentation, praktische CLI-Guides und alle Infos, die
            du brauchst, um eigene Extensions zu entwickeln.
          </Text>
          <Link href="https://developer.mittwald.de" target="_blank">
            Zum Developer-Portal
          </Link>
        </Section>
      </AccentBox>
    </Flex>
  );
};

export default Home;
