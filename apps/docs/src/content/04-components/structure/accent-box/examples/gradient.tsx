import {
  AccentBox,
  Color,
  Flex,
  Heading,
  Link,
  Text,
} from "@mittwald/flow-react-components";

<AccentBox backgroundColor="gradient" color="dark">
  <Flex align="center" wrap="wrap" gap="m">
    <Flex direction="column" grow>
      <Heading size="l">
        <Color color="violet">mStudio Extension</Color>{" "}
        selber entwickeln
      </Heading>
      <Text>
        <strong>
          Veröffentliche{" "}
          <Color color="violet">eigene Features</Color> im
          mStudio
        </strong>
      </Text>
    </Flex>
    <Link target="_blank" href="#">
      Contributor Landingpage
    </Link>
  </Flex>
</AccentBox>;
