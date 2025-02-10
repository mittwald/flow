import { Heading } from "@mittwald/flow-react-components";
import { IllustratedMessage } from "@mittwald/flow-react-components";
import { IconDanger } from "@mittwald/flow-react-components";
import { Text } from "@mittwald/flow-react-components";
import { Button } from "@mittwald/flow-react-components";

<IllustratedMessage color="danger">
  <IconDanger />
  <Heading>Kein Zugriff</Heading>
  <Text>
    Du hast keine Berechtigung, um auf diese Seite
    zuzugreifen.
  </Text>
  <Button>Zum Dashboard</Button>
</IllustratedMessage>;
