import Heading from "@mittwald/flow-react-components/Heading";
import IllustratedMessage from "@mittwald/flow-react-components/IllustratedMessage";
import { IconDanger } from "@mittwald/flow-react-components/Icons";
import Text from "@mittwald/flow-react-components/Text";
import Button from "@mittwald/flow-react-components/Button";

<IllustratedMessage variant="danger">
  <IconDanger />
  <Heading>No access</Heading>
  <Text>
    You do not have the required permissions to access this
    page.
  </Text>
  <Button>Go back</Button>
</IllustratedMessage>;
