import { Button, Text } from "@/auto-generated";
import { useState } from "react";

export const standard = () => <Button data-testid="button">Click me</Button>;

export const eventhandler = () => {
  const [eventData, setEventData] = useState<object>({});
  return (
    <>
      <Text data-testid="event-data">
        {JSON.stringify({
          ...eventData,
          // Mute flaky position
          x: undefined,
          y: undefined,
        })}
      </Text>
      <Button data-testid="button" onPress={setEventData}>
        Click me
      </Button>
    </>
  );
};
