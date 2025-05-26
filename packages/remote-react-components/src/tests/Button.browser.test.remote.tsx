import { Button, Text } from "@/auto-generated";
import { useState } from "react";

export const standard = () => <Button data-testid="button">Click me</Button>;

export const eventhandler = () => {
  const [pressed, setPressed] = useState(false);
  return (
    <>
      <Text data-testid="event-data">{String(pressed)}</Text>
      <Button data-testid="button" onPress={() => setPressed(true)}>
        Click me
      </Button>
    </>
  );
};
