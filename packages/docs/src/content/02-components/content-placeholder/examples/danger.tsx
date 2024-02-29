import Heading from "@mittwald/flow-react-components/Heading";
import ContentPlaceholder from "@mittwald/flow-react-components/ContentPlaceholder";
import { IconDanger } from "@mittwald/flow-react-components/Icons";
import Text from "@mittwald/flow-react-components/Text";
import Button from "@mittwald/flow-react-components/Button";

<ContentPlaceholder variant="danger">
  <IconDanger />
  <Heading>No access</Heading>
  <Text>
    You do not have the required permissions to access this
    page.
  </Text>
  <Button>Go back</Button>
</ContentPlaceholder>;
