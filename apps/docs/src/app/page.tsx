"use client";
import {
  AccentBox,
  Badge,
  ColumnLayout,
  Flex,
  Heading,
  LayoutCard,
  Link,
  Section,
  Text,
  Image,
  IconExtension,
  IconCode,
  Color,
  Icon,
} from "@mittwald/flow-react-components";
import type { FC } from "react";
import React from "react";
import { FlowLogo } from "@/app/_components/layout/Header/FlowLogo";
import darkmodeBg from "../../public/assets/darkmode-bg.png";
import developerTile from "../../public/assets/developer-tile.png";
import extensionsTile from "../../public/assets/extensions-tile.webp";
import clsx from "clsx";
import codeStyles from "@/lib/liveCode/components/LiveCodeEditor/LiveCodeEditor.module.css";
import {
  LiveEditor,
  LivePreview,
  LiveProvider,
} from "@mfalkenberg/react-live-ssr";
import { flowTheme } from "@/lib/liveCode/components/LiveCodeEditor/lib/flowTheme";
import extractDefaultExport from "@/lib/liveCode/components/LiveCodeEditor/lib/extractDefaultExport";
import { extractEditorScope } from "@/lib/liveCode/components/LiveCodeEditor/lib/extractEditorScope";
import styles from "./page.module.css";
import {
  IconBooks,
  IconComponents,
  IconDeviceLaptop,
} from "@tabler/icons-react";

const Home: FC = () => {
  const transformCode = (code: string) => {
    try {
      return extractDefaultExport(code);
    } catch (error) {
      return `<p><em>Example could not be parsed:</em> ${String(error)}</p>`;
    }
  };

  const code =
    'import { Button } from "@mittwald/flow-react-components";\n' +
    "\n" +
    '<Button color="primary"> \n' +
    "  Button\n" +
    "</Button>";

  const scope = extractEditorScope(code);

  return (
    <Flex direction="column" className={styles.wrapper}>
      <Flex direction="column" align="center" padding="xl" gap="l">
        <FlowLogo aria-hidden className={styles.logo} />
        <Heading level={1}>mStudio Design System</Heading>
      </Flex>
      <ColumnLayout l={[1, 1]} gap="xl">
        <LayoutCard>
          <AccentBox backgroundColor="gradient" color="dark-static">
            <Section>
              <Heading>Im Design System starten</Heading>
              <Text>
                Konsistente Komponenten und Patterns im Einklang mit der Marke
                fördern nutzerzentriertes, barrierearmes Design und sorgen für
                eine starke Developer Experience.
              </Text>
              <Link href="/01-get-started/installation">Zu Get Started</Link>
            </Section>
          </AccentBox>
        </LayoutCard>
        <LayoutCard>
          <AccentBox
            backgroundImage={darkmodeBg.src}
            color="light-static"
            className={styles.darkModeTile}
          >
            <ColumnLayout m={[2, 1]}>
              <Section className={styles.darkModeContent}>
                <Heading>
                  Dark-Mode entdecken<Badge color="violet">Neu</Badge>
                </Heading>
                <Text>
                  Capre Noctem - Nutze die Dunkelheit! Ab jetzt unterstützt
                  unser Design System ein Light- und ein Dark-Theme.
                </Text>
                <Link href="/02-foundations/01-design/03-themes">
                  Mehr erfahren
                </Link>
              </Section>
            </ColumnLayout>
          </AccentBox>
        </LayoutCard>
      </ColumnLayout>
      <LayoutCard className={styles.codeTile}>
        <ColumnLayout l={[1, 1]} gap="xl">
          <Section>
            <Heading>Fokus auf Developer Experience</Heading>
            <Text>
              Verschachtelte Komponenten erleichtern das Einfügen.
              Automatisierungen ordnen Komponenten automatisch mit passenden
              Abständen an und verhindern Abweichungen vom Design System. Alles
              Open Source auf{" "}
              <Link href="https://github.com/mittwald/flow" target="_blank">
                GitHub
              </Link>{" "}
              verfügbar und hier im Styleguide dokumentiert.
            </Text>
            <Link href="/04-components/actions/action-group/overview">
              Zu Components
            </Link>
          </Section>
          <LiveProvider transformCode={transformCode} code={code} scope={scope}>
            <div className={clsx(codeStyles.liveCodeEditor)}>
              <LivePreview className={clsx(codeStyles.preview)} />

              <div className={codeStyles.editorContainer}>
                <LiveEditor
                  tabMode="focus"
                  theme={flowTheme}
                  className={codeStyles.editor}
                />
              </div>
            </div>
          </LiveProvider>
        </ColumnLayout>
      </LayoutCard>
      <ColumnLayout l={[1, 1]} gap="xl">
        <LayoutCard>
          <AccentBox
            backgroundColor="blue"
            color="dark"
            className={styles.imageTile}
          >
            <ColumnLayout s={[1, 1]}>
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
              <Image src={developerTile.src} />
              <Color color="light-static" className={styles.imageTileIcon}>
                <IconCode size="l" aria-hidden />
              </Color>
            </ColumnLayout>
          </AccentBox>
        </LayoutCard>
        <LayoutCard>
          <AccentBox
            backgroundColor="lilac"
            color="dark"
            className={styles.imageTile}
          >
            <ColumnLayout s={[1, 1]}>
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
                  Mehr erfahren
                </Link>
              </Section>
              <Image src={extensionsTile.src} />
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
            <Heading>
              <Icon>
                <IconDeviceLaptop />
              </Icon>
              Get Started
            </Heading>
            <Text>Installiere Flow und starte in wenigen Schritten.</Text>
            <Link href="/01-get-started/installation">Get started</Link>
          </Section>
        </LayoutCard>
        <LayoutCard>
          <Section>
            <Heading>
              <Icon>
                <IconBooks />
              </Icon>
              Foundations
            </Heading>
            <Text>
              Erfahre mehr über die Grundlagen unseres Design Systems.
            </Text>
            <Link href="/02-foundations/01-design/01-design-tokens">
              Foundations
            </Link>
          </Section>
        </LayoutCard>
        <LayoutCard>
          <Section>
            <Heading>
              <Icon>
                <IconComponents />
              </Icon>
              Components
            </Heading>
            <Text>
              Nutze unseren modularen Components-Baukasten für dein Projekt.
            </Text>
            <Link href="/04-components/actions/action-group">Components</Link>
          </Section>
        </LayoutCard>
      </ColumnLayout>
    </Flex>
  );
};

export default Home;
