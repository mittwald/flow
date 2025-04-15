import {
  AccentBox,
  BigNumber,
  ColumnLayout,
  Flex,
  Rating,
  Text,
} from "@mittwald/flow-react-components";

<ColumnLayout>
  <AccentBox>
    <Flex direction="column" gap="s" align="center">
      <BigNumber>
        <Text>250 ms</Text>
        <Text>Dateioperationen</Text>
      </BigNumber>
      <Rating value={4} />
      <Text>
        <small>Geringer Optimierungsbedarf</small>
      </Text>
    </Flex>
  </AccentBox>
  <AccentBox>
    <Flex direction="column" gap="xs" align="center">
      <BigNumber>
        <Text>100 ms</Text>
        <Text>Serveroperationen</Text>
      </BigNumber>
      <Rating value={2} />
      <Text>
        <small>Optimierungsbedarf</small>
      </Text>
    </Flex>
  </AccentBox>
</ColumnLayout>;
