import { Button } from "@mittwald/flow-react-components";
import { Heading } from "@mittwald/flow-react-components";
import { Text } from "@mittwald/flow-react-components";
import { useNotificationController } from "@mittwald/flow-react-components";
import { Notification } from "@mittwald/flow-react-components";

export default () => {
  const controller = useNotificationController();

  return (
    <Button
      onPress={() =>
        controller.add(
          <Notification
            onClick={() => alert("Notification clicked")}
            status="warning"
            autoClose
          >
            <Heading>No SSL certificate</Heading>
            <Text>
              No SSL certificate could be issued for
              examples.de.
            </Text>
          </Notification>,
        )
      }
    >
      Trigger Notification
    </Button>
  );
};
