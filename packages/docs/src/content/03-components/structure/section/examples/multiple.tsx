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
    <Heading>Newsletter</Heading>
    <Text>
      Kommende Releases, neue Features und Tipps rund um
      dein Hosting – wir bringen dir das Wichtigste in dein
      Postfach. Abonniere unseren Newsletter und bleib auf
      dem Laufenden.
    </Text>
    <Link href="#">Newsletter abonnieren</Link>
  </Section>
</>;
