import { Button, Text } from "../../src/auto-generated";
import { useState } from "react";

export const standard = () => <Button data-testid="button">Click me</Button>;

export const eventhandler = () => {
  const [eventData, setEventData] = useState<Record<string, string>>({});
  return (
    <>
      <Text data-testid="event-data">
        {JSON.stringify({
          // Mute flaky position
          type: eventData["type"],
        })}
      </Text>
      <Button data-testid="button" onPress={setEventData}>
        Click me
      </Button>
    </>
  );
};
