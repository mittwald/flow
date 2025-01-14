import { Button } from "@mittwald/flow-react-components/Button";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { Text } from "@mittwald/flow-react-components/Text";
import { useNotificationController } from "@mittwald/flow-react-components/NotificationProvider";
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
