"use client";
import {
  AccentBox,
  Color,
  ColumnLayout,
  Flex,
  Heading,
  Icon,
  IconCode,
  IconExtension,
  IllustratedMessage,
  Image,
  LayoutCard,
  Link,
  Section,
  Text,
} from "@mittwald/flow-react-components";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCubes,
  faObjectsColumn,
  faPalette,
  faRocket,
} from "@fortawesome/sharp-regular-svg-icons";
import clsx from "clsx";
import type { FC, PropsWithChildren } from "react";
import { FlowLogo } from "@/app/_components/layout/Header/FlowLogo";
import heroBand from "../../../../public/assets/hero-band.webp";
import overviewBand from "../../../../public/assets/overview-band.webp";
import developerTile from "../../../../public/assets/developer-tile.webp";
import extensionsTile from "../../../../public/assets/extensions-tile.webp";
import { ComposingCodeExample } from "@/app/_components/ComposingCodeExample";
import { flowDarkScopeClass } from "@/app/_components/FlowDarkScope/flowDarkScopeClass";
import styles from "./HomePage.module.scss";

interface OverviewTileProps {
  icon: IconDefinition;
  title: string;
  href: string;
  linkText: string;
}

/** An entry point into a Styleguide section, like the developer portal's */
const OverviewTile: FC<PropsWithChildren<OverviewTileProps>> = (props) => {
  const { icon, title, href, linkText, children } = props;
  return (
    <LayoutCard>
      <IllustratedMessage>
        <Icon>
          <FontAwesomeIcon icon={icon} />
        </Icon>
        <Heading>{title}</Heading>
        <Text>{children}</Text>
        <Link href={href} inline>
          {linkText}
        </Link>
      </IllustratedMessage>
    </LayoutCard>
  );
};

export const HomePage: FC = () => {
  return (
    <Flex
      direction="column"
      className={styles.wrapper}
      align="center"
      data-page="home"
    >
      <AccentBox
        backgroundImage={heroBand.src}
        className={clsx(styles.band, styles.top, flowDarkScopeClass)}
      >
        <Flex direction="column" align="center" gap="xl">
          <Flex direction="column" align="center" gap="l">
            <FlowLogo aria-hidden className={styles.logo} />
            <Heading level={1}>mStudio Design System</Heading>
          </Flex>
          <div className={styles.bandContent}>
            <LayoutCard>
              <Flex direction="column" gap="xl">
                <div className={styles.heroExample}>
                  <ComposingCodeExample />
                </div>
                <Section>
                  <Heading>Fokus auf Developer Experience</Heading>
                  <Text>
                    Verschachtelte Components erleichtern das Einfügen.
                    Automatisierungen ordnen Components automatisch mit
                    passenden Abständen an und verhindern Abweichungen vom
                    Design System. Alles Open Source auf{" "}
                    <Link
                      href="https://github.com/mittwald/flow"
                      target="_blank"
                    >
                      GitHub
                    </Link>{" "}
                    verfügbar und hier im Styleguide dokumentiert.
                  </Text>
                  <Link href="/components/actions/action-group">
                    Zu den Components
                  </Link>
                </Section>
              </Flex>
            </LayoutCard>
          </div>
        </Flex>
      </AccentBox>

      <ColumnLayout l={[1, 1]} gap="xl" s={[1]}>
        <LayoutCard>
          <AccentBox
            backgroundColor="navy"
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

      <AccentBox
        backgroundImage={overviewBand.src}
        className={clsx(styles.band, styles.overviewBand, flowDarkScopeClass)}
      >
        <div className={clsx(styles.bandContent, styles.wideBandContent)}>
          <ColumnLayout
            l={[1, 1, 1, 1]}
            m={[1, 1]}
            gap="xl"
            className={styles.overviewTiles}
          >
            <OverviewTile
              icon={faRocket}
              title="Get Started"
              href="/get-started/installation"
              linkText="Zu Get Started"
            >
              Installiere Flow und starte direkt mit deinem Projekt.
            </OverviewTile>
            <OverviewTile
              icon={faPalette}
              title="Foundations"
              href="/foundations/design/design-tokens"
              linkText="Zu den Foundations"
            >
              Erfahre mehr über die Grundlagen unseres Design Systems.
            </OverviewTile>
            <OverviewTile
              icon={faObjectsColumn}
              title="Templates"
              href="/templates/app-shells/focus-task"
              linkText="Zu den Templates"
            >
              Finde passende Templates für häufige Design- und
              Interaktionsaufgaben.
            </OverviewTile>
            <OverviewTile
              icon={faCubes}
              title="Components"
              href="/components/actions/action-group"
              linkText="Zu den Components"
            >
              Nutze unseren modularen Components-Baukasten für dein Projekt.
            </OverviewTile>
          </ColumnLayout>
        </div>
      </AccentBox>
    </Flex>
  );
};
