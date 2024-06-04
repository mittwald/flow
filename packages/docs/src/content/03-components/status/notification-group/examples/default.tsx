import {
  NotificationController,
  NotificationGroup,
} from "@mittwald/flow-react-components/NotificationGroup";
import { Button } from "@mittwald/flow-react-components/Button";

() => {
  const controller = NotificationController.useNew();

  return (
    <>
      <NotificationGroup controller={controller} />
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
