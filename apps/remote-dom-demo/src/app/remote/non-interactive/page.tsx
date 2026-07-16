"use client";
import {
  Alert,
  Button,
  Content,
  Heading,
  Label,
  Text,
  TextField,
} from "@mittwald/flow-remote-react-components";

export default function Page() {
  return (
    <Alert status="danger">
      <Heading>Mission failed</Heading>
      <Text>The assault on the Death Star could not be completed.</Text>
      <TextField>
        <Label>Mission name</Label>
      </TextField>
      <Content>
        <Button>Retry</Button>
      </Content>
    </Alert>
  );
}
