"use client";
import type { FC } from "react";
import React from "react";
import { LayoutCard } from "@mittwald/flow-react-components/LayoutCard";
import { ColumnLayout } from "@mittwald/flow-react-components/ColumnLayout";
import { Section } from "@mittwald/flow-react-components/Section";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { Header } from "@mittwald/flow-react-components/Header";
import { Link } from "@mittwald/flow-react-components/Link";
import styles from "./footer.module.scss";
import { Image } from "@mittwald/flow-react-components/Image";
import feedback from "../../../../../assets/Styleguide-Footer_Feedback.svg";
import logoMittwald from "../../../../../assets/mittwald-logo-footer.svg";
import clsx from "clsx";

const Footer: FC = () => {
  return (
    <LayoutCard elementType="footer" className={styles.footer}>
      <ColumnLayout m={[1, 1, 2]} l={[1, 1, 2, 1]}>
        <Section>
          <Header>
            <Heading level={3}>Contributoren-Seiten</Heading>
          </Header>
          <Link color="dark" href="https://github.com/mittwald/flow">
            GitHub Repo
          </Link>
          <Link color="dark" href="https://developer.mittwald.de/">
            Developer-Portal
          </Link>
        </Section>
        <Section>
          <Header>
            <Heading level={3}>Rechtliches</Heading>
          </Header>
          <Link color="dark" href="https://www.mittwald.de/impressum">
            Impressum
          </Link>
          <Link color="dark" href="https://www.mittwald.de/datenschutz">
            Datenschutz
          </Link>
        </Section>

        <Section>
          <Heading level={3}>Hilf uns, Flow noch besser zu machen!</Heading>
          Fehlt dir eine bestimmte Component oder etwas Anderes? Hast du
          Feedback? Dann teile es uns gerne auf GitHub mit.
          <Link
            color="dark"
            href="https://github.com/mittwald/flow/issues/new?template=general-style-guide-feedback.md"
          >
            Feedback zu Flow geben
          </Link>
        </Section>
        <Image
          src={feedback.src}
          alt="Styleguide Feedback"
          className={clsx(styles.feedbackPicture)}
        />
      </ColumnLayout>
      <br />
      <small>
        <Image src={logoMittwald.src} alt="mittwald Logo" />© 2024 Mittwald CM
        Service GmbH & Co. KG
      </small>
    </LayoutCard>
  );
};

export default Footer;
