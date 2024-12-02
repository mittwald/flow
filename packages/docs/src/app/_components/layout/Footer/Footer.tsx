"use client";
import type { FC } from "react";
import React from "react";
import { LayoutCard } from "@mittwald/flow-react-components/LayoutCard";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { Link } from "@mittwald/flow-react-components/Link";
import styles from "./footer.module.scss";
import { Image } from "@mittwald/flow-react-components/Image";
import feedback from "../../../../../assets/Styleguide-Footer_Feedback.svg";
import logoMittwald from "../../../../../assets/mittwald-logo-footer.svg";

const Footer: FC = () => {
  return (
    <LayoutCard elementType="footer" className={styles.footer}>
      <div className={styles.footerColumnLayout}>
        <div className={styles.footerSection}>
          <Heading level={3}>Contributoren-Seiten</Heading>
          <div className={styles.footerSectionContent}>
            <Link color="dark" href="https://github.com/mittwald/flow">
              GitHub Repo
            </Link>
            <Link color="dark" href="https://developer.mittwald.de/">
              Developer-Portal
            </Link>
          </div>
        </div>
        <div className={styles.footerSection}>
          <Heading level={3}>Rechtliches</Heading>
          <div className={styles.footerSectionContent}>
            <Link color="dark" href="https://www.mittwald.de/impressum">
              Impressum
            </Link>
            <Link color="dark" href="https://www.mittwald.de/datenschutz">
              Datenschutz
            </Link>
          </div>
        </div>

        <div className={styles.footerSection}>
          <Heading level={3}>Hilf uns, Flow noch besser zu machen!</Heading>
          Fehlt dir eine bestimmte Component oder etwas Anderes? Hast du
          Feedback? Dann teile es uns gerne auf GitHub mit.
          <Link
            className={styles.feedbackLink}
            color="dark"
            href="https://github.com/mittwald/flow/issues/new?template=general-style-guide-feedback.md"
          >
            Feedback zu Flow geben
          </Link>
        </div>
        <Image
          src={feedback.src}
          alt="Styleguide Feedback"
          className={styles.feedbackPicture}
        />
        <div className={styles.mittwaldLogo}>
          <Image src={logoMittwald.src} alt="mittwald Logo" />© 2024 Mittwald
          CM Service GmbH & Co. KG
        </div>
      </div>
    </LayoutCard>
  );
};

export default Footer;
