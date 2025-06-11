import { Alert, Text } from "@mittwald/flow-remote-react-components";

export const WrongAnswerAlert = () => {
  return (
    <Alert status="danger">
      <Text>Das war leider falsch. Versuch's nochmal!</Text>
    </Alert>
  );
};
