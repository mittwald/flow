import { Button, Text } from "@/auto-generated";

export const standard = () => <Button data-testid="button">Click me</Button>;

export const eventhandler = () => {
  return (
    <>
      <Text data-testid="event-data">test</Text>
      <Button data-testid="button">Click me</Button>
    </>
  );
};
