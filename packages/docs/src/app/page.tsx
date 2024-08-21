import LayoutCard from "@mittwald/flow-react-components/LayoutCard";
import type { FC } from "react";
import React from "react";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { Text } from "@mittwald/flow-react-components/Text";
import { Section } from "@mittwald/flow-react-components/Section";
import { Link } from "@mittwald/flow-react-components/Link";
import { ColumnLayout } from "@mittwald/flow-react-components/ColumnLayout";
import { StatusBadge } from "@mittwald/flow-react-components/StatusBadge";
import Icon from "@mittwald/flow-react-components/Icon";
import {
  IconBooks,
  IconComponents,
  IconDeviceLaptop,
} from "@tabler/icons-react";

const Home: FC = () => {
  return (
    <ColumnLayout l={[1]} m={[1]}>
      <LayoutCard>
        <Section>
          {/*
          @todo: image is not loading in preview app
            <Image
            className={styles.homeImage}
            src="/home.svg"
            alt="Flow Design System"
          />
          */}

          <Heading level={1}>
            Flow Design System <StatusBadge>beta</StatusBadge>
          </Heading>
          <Text>
            Entwickle performante und nutzerzentrierte Benutzeroberflächen, die
            die Markenidentität von mittwald konsistent widerspiegeln.
          </Text>
        </Section>
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
                State-of-the-Art: Wir halten uns an Best Practices für
                leistungsfähige und nutzerzentrierte Benutzeroberflächen.
              </li>
              <li>
                Open-Source: Flow ist 100 % öffentlich auf{" "}
                <Link href="https://github.com/mittwald/flow">GitHub</Link>.
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
            <Link href="01-get-started/installation">Get started</Link>
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
            <Link href="02-foundations/content-guidelines/fehlermeldungen">
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
            <Link href="03-components/actions/action-group">Components</Link>
          </Section>
        </LayoutCard>
      </ColumnLayout>
    </ColumnLayout>
  );
};

export default Home;
