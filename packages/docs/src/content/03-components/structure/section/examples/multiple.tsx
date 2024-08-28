import Heading from "@mittwald/flow-react-components/Heading";
import Text from "@mittwald/flow-react-components/Text";
import Link from "@mittwald/flow-react-components/Link";
import Section from "@mittwald/flow-react-components/Section";
import Header from "@mittwald/flow-react-components/Header";
import { Button } from "@mittwald/flow-react-components/Button";

<>
  <Section>
    <Header>
      <Heading>Datenbanken</Heading>
      <Button>Datenbank verknüpfen</Button>
    </Header>
    <Text>
      Eine Datenbank, die mit einer App verknüpft ist, kann
      nicht gelöscht werden. Die App nutzt immer die
      verknüpfte Datenbank.
    </Text>
  </Section>
  <Section>
    <Heading>Cronjobs</Heading>
    <Text>
      Ein Cronjob ist immer fest einer App zugeordnet, du
      kannst ihn unter dem Menüpunkt Cronjobs bearbeiten und
      löschen.
    </Text>
  </Section>
</>;
