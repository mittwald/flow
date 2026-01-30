import {
  BigNumber,
  Flex,
  Rating,
  Text,
} from "@mittwald/flow-react-components";

<Flex direction="column" gap="s" align="center">
  <BigNumber>
    <Text>80%</Text>
    <Text>Performance</Text>
  </BigNumber>
  <Rating aria-label="Performance" value={4} isReadOnly />
</Flex>;
