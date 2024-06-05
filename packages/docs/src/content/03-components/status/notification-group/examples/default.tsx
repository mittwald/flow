import {
  NotificationController,
  NotificationProvider,
} from "@mittwald/flow-react-components/NotificationProvider";
import { Button } from "@mittwald/flow-react-components/Button";

export default () => {
  const controller = NotificationController.useNew();

  return (
    <>
      <NotificationProvider controller={controller} />
      <Button
        onPress={() =>
          controller.add({
            heading: "Kein SSL-Zertifikat",
            text: (
              <>
                Für <b>example.de</b> konnte kein
                SSL-Zertifikat ausgestellt werden.
              </>
            ),
            status: "warning",
            onClick: () => alert("Notification clicked"),
          })
        }
      >
        Trigger Notification
      </Button>
    </>
  );
};
