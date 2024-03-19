import { NotificationProvider } from "@mittwald/flow-react-components/Notification";
import { Button } from "@mittwald/flow-react-components/Button";

<NotificationProvider>
  {(state) => (
    <Button
      onPress={() =>
        state.add(
          {
            content: "Your ticket has been closed.",
            title: "Ticket closed",
            onPress: () => console.log("pressed"),
          },
          { timeout: 10000 },
        )
      }
    >
      Show notification
    </Button>
  )}
</NotificationProvider>;
