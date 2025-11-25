"use client";
import {
  Flex,
  Heading,
  Image,
  Link,
  Text,
} from "@mittwald/flow-react-components";
import React, { type FC } from "react";
import logoMittwald from "../../../../../assets/mittwald-logo-footer.svg";
import styles from "./footer.module.scss";
import { DateTime } from "luxon";
import feedback from "../../../../../assets/Styleguide-Footer_Feedback.svg";

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
          <Flex gap="xl">
            <Flex
              elementType="section"
              direction="column"
              gap="s"
              className={styles.resources}
            >
              <Heading size="s">Ressourcen</Heading>
              <Link
                whiteSpace="nowrap"
                color="dark"
                href="https://github.com/mittwald/flow"
                target="_blank"
              >
                GitHub Repo
              </Link>
              <Link
                whiteSpace="nowrap"
                color="dark"
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
              <Heading size="s">Rechtliches</Heading>
              <Link
                whiteSpace="nowrap"
                color="dark"
                href="https://www.mittwald.de/impressum"
                target="_blank"
              >
                Impressum
              </Link>
              <Link
                whiteSpace="nowrap"
                color="dark"
                href="https://www.mittwald.de/datenschutz"
                target="_blank"
              >
                Datenschutz
              </Link>
            </Flex>
          </Flex>
          <Flex direction="column" gap="xs" className={styles.mittwaldLogo}>
            <Image src={logoMittwald.src} alt="mittwald Logo" width={300} />
            <Text whiteSpace="nowrap">
              <small>© {year} Mittwald CM Service GmbH & Co. KG</small>
            </Text>
          </Flex>
        </Flex>

        <Flex className={styles.feedback} gap="xl">
          <Flex elementType="section" direction="column" gap="s">
            <Heading size="s">Hilf uns, Flow noch besser zu machen!</Heading>
            <Text>
              Fehlt dir eine bestimmte Component oder etwas Anderes? Hast du
              Feedback? Dann teile es uns gerne auf GitHub mit.
            </Text>
            <Link
              className={styles.feedbackLink}
              color="dark"
              href="https://github.com/mittwald/flow/issues/new?template=general-style-guide-feedback.md"
              target="_blank"
            >
              Feedback zu Flow geben
            </Link>
          </Flex>
          <Image
            src={feedback.src}
            alt="Styleguide Feedback"
            className={styles.feedbackImage}
            width={200}
          />
        </Flex>
      </Flex>
    </footer>
  );
};

export default Footer;
