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
      <Heading>Alert title</Heading>
      <Text>Alert text</Text>
      <TextField>
        <Label>Name</Label>
      </TextField>
      <Content>
        <Button>Test</Button>
      </Content>
    </Alert>
  );
}
