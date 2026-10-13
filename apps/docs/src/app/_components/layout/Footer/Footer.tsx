"use client";
import { Flex, Heading, Link, Text } from "@mittwald/flow-react-components";
import { type FC } from "react";
import styles from "./Footer.module.scss";
import { DateTime } from "luxon";
import { MittwaldLogo } from "@/app/_components/layout/Footer/MittwaldLogo";

const Footer: FC = () => {
  const year = DateTime.now().year;

  return (
    <footer className={styles.footer}>
      <Flex
        gap="xl"
        justify="space-between"
        wrap="wrap-reverse"
        className={styles.footerContent}
      >
        <Flex direction="column" grow gap="xl">
          <Flex gap="xl" wrap="wrap">
            <Flex
              elementType="section"
              direction="column"
              gap="s"
              className={styles.resources}
            >
              <Heading size="s" color="light-static">
                Ressourcen
              </Heading>
              <Link
                whiteSpace="nowrap"
                color="light-static"
                href="https://github.com/mittwald/flow"
                target="_blank"
              >
                GitHub Repo
              </Link>
              <Link
                whiteSpace="nowrap"
                color="light-static"
                href="https://developer.mittwald.de/"
                target="_blank"
              >
                Developer-Portal
              </Link>
            </Flex>
            <Flex
              elementType="section"
              direction="column"
              gap="s"
              className={styles.legal}
            >
              <Heading size="s" color="light-static">
                Rechtliches
              </Heading>
              <Link
                whiteSpace="nowrap"
                color="light-static"
                href="https://www.mittwald.de/impressum"
                target="_blank"
              >
                Impressum
              </Link>
              <Link
                whiteSpace="nowrap"
                color="light-static"
                href="https://www.mittwald.de/datenschutz"
                target="_blank"
              >
                Datenschutz
              </Link>
            </Flex>
          </Flex>
          <Flex direction="column" gap="xs">
            <MittwaldLogo />
            <Text className={styles.muted}>
              <small>© {year} Mittwald CM Service GmbH & Co. KG</small>
            </Text>
          </Flex>
        </Flex>

        <Flex elementType="section" direction="column" gap="s">
          <Heading size="s" color="light-static">
            Hilf uns, Flow noch besser zu machen!
          </Heading>
          <Text className={styles.muted}>
            Fehlt dir eine bestimmte Component oder etwas Anderes? Hast du
            Feedback? Dann teile es uns gerne auf GitHub mit.
          </Text>
          <Link
            color="light-static"
            href="https://github.com/mittwald/flow/issues/new?template=general-style-guide-feedback.md"
            target="_blank"
          >
            Feedback zu Flow geben
          </Link>
        </Flex>
      </Flex>
    </footer>
  );
};

export default Footer;
