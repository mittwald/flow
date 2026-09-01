import {
  AccentBox,
  BigNumber,
  ColumnLayout,
  Flex,
  Rating,
  Section,
  Text,
} from "@mittwald/flow-react-components";

<Section>
  <ColumnLayout>
    <AccentBox backgroundColor="neutral">
      <Flex direction="column" gap="s" align="center">
        <BigNumber>
          <Text>250 ms</Text>
          <Text>Dateioperationen</Text>
        </BigNumber>
        <Rating
          value={4}
          isReadOnly
          aria-label="Dateioperationen"
        />
        <Text>
          <small>Geringer Optimierungsbedarf</small>
        </Text>
      </Flex>
    </AccentBox>
    <AccentBox backgroundColor="blue">
      <Flex direction="column" gap="xs" align="center">
        <BigNumber>
          <Text>100 ms</Text>
          <Text>Serveroperationen</Text>
        </BigNumber>
        <Rating
          value={2}
          isReadOnly
          aria-label="Serveroperationen"
        />
        <Text>
          <small>Optimierungsbedarf</small>
        </Text>
      </Flex>
    </AccentBox>
  </ColumnLayout>
</Section>;
