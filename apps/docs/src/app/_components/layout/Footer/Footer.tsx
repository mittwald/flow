"use client";
import {
  ColumnLayout,
  Image,
  Link,
  Text,
} from "@mittwald/flow-react-components";
import type { FC } from "react";
import logoMittwald from "../../../../../assets/mittwald-logo-footer.svg";
import { FooterSection } from "./components/FooterSection";
import styles from "./footer.module.scss";

const Footer: FC = () => {
  return (
    <footer className={styles.footer}>
      <ColumnLayout gap="xl" m={[1, 1, 2]} l={[1, 1, 2]} s={[1]}>
        <FooterSection title="Ressourcen">
          <Link
            color="dark"
            href="https://github.com/mittwald/flow"
            target="_blank"
          >
            GitHub Repo
          </Link>
          <Link
            color="dark"
            href="https://developer.mittwald.de/"
            target="_blank"
          >
            Developer-Portal
          </Link>
        </FooterSection>
        <FooterSection title="Rechtliches">
          <Link
            color="dark"
            href="https://www.mittwald.de/impressum"
            target="_blank"
          >
            Impressum
          </Link>
          <Link
            color="dark"
            href="https://www.mittwald.de/datenschutz"
            target="_blank"
          >
            Datenschutz
          </Link>
        </FooterSection>
        <FooterSection title="Hilf uns, Flow noch besser zu machen!">
          Fehlt dir eine bestimmte Component oder etwas Anderes? Hast du
          Feedback? Dann teile es uns gerne auf GitHub mit.
          <Link
            className={styles.feedbackLink}
            color="dark"
            href="https://github.com/mittwald/flow/issues/new?template=general-style-guide-feedback.md"
            target="_blank"
          >
            Feedback zu Flow geben
          </Link>
        </FooterSection>
      </ColumnLayout>
      <div className={styles.mittwaldLogo}>
        <Image src={logoMittwald.src} alt="mittwald Logo" />
        <Text>© 2024 Mittwald CM Service GmbH & Co. KG</Text>
      </div>
    </footer>
  );
};

export default Footer;
