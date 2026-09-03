import {
  Heading,
  IllustratedMessage,
  LoadingSpinner,
} from "@mittwald/flow-react-components";

export const LoadingMessage = () => (
  <IllustratedMessage>
    <LoadingSpinner />
    <Heading>Loading demo</Heading>
  </IllustratedMessage>
);
