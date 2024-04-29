import Heading from "@mittwald/flow-react-components/Heading";
import Text from "@mittwald/flow-react-components/Text";
import Link from "@mittwald/flow-react-components/Link";
import Section from "@mittwald/flow-react-components/Section";
import TextField from "@mittwald/flow-react-components/TextField";
import Label from "@mittwald/flow-react-components/Label";
import { IconMember } from "@mittwald/flow-react-components/Icons";

<>
  <Section>
    <Heading>
      <IconMember />
      Persönliche Informationen
    </Heading>
    <TextField isRequired defaultValue="John">
      <Label>Vorname</Label>
    </TextField>
    <TextField isRequired defaultValue="Doe">
      <Label>Nachname</Label>
    </TextField>
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
