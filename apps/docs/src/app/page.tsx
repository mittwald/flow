import {
  AlertBadge,
  ColumnLayout,
  Heading,
  Icon,
  Image,
  LayoutCard,
  Link,
  Section,
  Text,
} from "@mittwald/flow-react-components";
import type { FC } from "react";
import React from "react";
import {
  IconBooks,
  IconComponents,
  IconDeviceLaptop,
} from "@tabler/icons-react";
import homeImage from "../../assets/Styleguide_Startseite.svg";
import styles from "./layout.module.scss";

const Home: FC = () => {
  return (
    <ColumnLayout l={[1]} m={[1]}>
      <LayoutCard className={styles.homeTopLayoutCard}>
        <Image
          className={styles.homeImage}
          src={homeImage.src}
          alt="Flow Design System"
        />
        <ColumnLayout l={[1]} className={styles.homeTopContent}>
          <Heading level={1}>
            Flow Design System <AlertBadge>beta</AlertBadge>
          </Heading>
          <Text>
            Entwickle performante und nutzerzentrierte Benutzeroberflächen, die
            die Markenidentität von mittwald konsistent widerspiegeln.
          </Text>
        </ColumnLayout>
      </LayoutCard>
      <LayoutCard>
        <Section>
          <Heading>Unsere Grundprinzipien</Heading>
          <Text>
            <ul>
              <li>
                Developer-Experience: Einfache Integration in gängige
                Frontend-Entwicklungsprozesse.
              </li>
              <li>
                State-of-the-Art: Wir halten uns an Best practices für
                leistungsfähige und nutzerzentrierte Benutzeroberflächen.
              </li>
              <li>
                Open-Source: Flow ist 100 % öffentlich auf{" "}
                <Link href="https://github.com/mittwald/flow" target="_blank">
                  GitHub
                </Link>
                .
              </li>
              <li>Accessibility: Alle Components sind barrierefrei.</li>
            </ul>
          </Text>
        </Section>
      </LayoutCard>
      <ColumnLayout l={[1, 1, 1]}>
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
            <Link href="/03-components/actions/action-group">Components</Link>
          </Section>
        </LayoutCard>
      </ColumnLayout>
    </ColumnLayout>
  );
};

export default Home;
