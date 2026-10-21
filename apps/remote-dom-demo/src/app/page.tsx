import {
  Heading,
  IconStar,
  IllustratedMessage,
  Text,
} from "@mittwald/flow-react-components";

export default function Page() {
  return (
    <IllustratedMessage>
      <IconStar />
      <Heading>No demo selected</Heading>
      <Text>Select a demo to explore a galaxy far, far away</Text>
    </IllustratedMessage>
  );
}
