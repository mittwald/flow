import {
  Button,
  Heading,
  Notification,
  Text,
  useNotificationController,
} from "@mittwald/flow-react-components";

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
