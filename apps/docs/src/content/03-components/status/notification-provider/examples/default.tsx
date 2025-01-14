import { Button } from "@mittwald/flow-react-components/Button";
import { useNotificationController } from "@mittwald/flow-react-components/NotificationProvider";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { Text } from "@mittwald/flow-react-components/Text";
import { Notification } from "@mittwald/flow-react-components/Notification";

export default () => {
  const controller = useNotificationController();

  return (
    <Button
      onPress={() =>
        controller.add(
          <Notification
            onClick={() => alert("Notification clicked")}
            status="warning"
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
