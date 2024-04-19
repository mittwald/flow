import Heading from "@mittwald/flow-react-components/Heading";
import IllustratedMessage from "@mittwald/flow-react-components/IllustratedMessage";
import { IconDanger } from "@mittwald/flow-react-components/Icons";
import Text from "@mittwald/flow-react-components/Text";
import Button from "@mittwald/flow-react-components/Button";

<IllustratedMessage variant="negative">
  <IconDanger />
  <Heading>Kein Zugriff</Heading>
  <Text>
    Du hast keine Berechtigung, um auf diese Seite
    zuzugreifen.
  </Text>
  <Button>Zum Dashboard</Button>
</IllustratedMessage>;
