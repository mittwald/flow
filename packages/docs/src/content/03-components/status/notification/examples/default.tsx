import Heading from "@mittwald/flow-react-components/Heading";
import Text from "@mittwald/flow-react-components/Text";
import Notification from "@mittwald/flow-react-components/Notification";

<Notification
  onClose={() => alert("Notification closed")}
  onClick={() => alert("Notification clicked")}
>
  <Heading>E-Mail-Adresse archiviert</Heading>
  <Text>
    Die E-Mail-Adresse <b>example@mittwald.de</b> wurde
    archiviert.
  </Text>
</Notification>;
