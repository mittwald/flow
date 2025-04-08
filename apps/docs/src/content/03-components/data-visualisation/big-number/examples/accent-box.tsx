import {
  AccentBox,
  BigNumber,
  Button,
  ColumnLayout,
  Flex,
  Text,
} from "@mittwald/flow-react-components";

<ColumnLayout>
  <AccentBox>
    <Flex direction="column" gap="s" align="center">
      <BigNumber>
        <Text>250 ms</Text>
        <Text>Dateioperationen</Text>
      </BigNumber>
      <Text>
        <small>Geringer Optimierungsbedarf</small>
      </Text>
      <Button size="s" variant="outline" color="secondary">
        Details anzeigen
      </Button>
    </Flex>
  </AccentBox>
  <AccentBox>
    <Flex direction="column" gap="xs" align="center">
      <BigNumber>
        <Text>100 ms</Text>
        <Text>Serveroperationen</Text>
      </BigNumber>
      <Text>
        <small>Optimierungsbedarf</small>
      </Text>
      <Button size="s" variant="outline" color="secondary">
        Details anzeigen
      </Button>
    </Flex>
  </AccentBox>
</ColumnLayout>;
