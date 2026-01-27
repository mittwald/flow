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
      onPress={() => {
        const filename = `export_${Math.round(Math.random() * 1000)}.zip`;

        const notificationId = controller.add(
          <Notification status="info" autoClose={false}>
            <Heading>File is downloading</Heading>
            <Text>
              The file "{filename}" is beeing downloaded.
            </Text>
          </Notification>,
        );

        setTimeout(() => {
          controller.remove(notificationId);
          controller.add(
            <Notification status="success" autoClose>
              <Heading>Download completed</Heading>
              <Text>
                The download of "{filename}" is completed.
              </Text>
            </Notification>,
          );
        }, 3000);
      }}
    >
      Trigger Notification
    </Button>
  );
};
