import {
  AccentBox,
  Color,
  Flex,
  Heading,
  Link,
  Text,
} from "@mittwald/flow-react-components";

<AccentBox color="gradient">
  <Flex align="center" wrap="wrap" gap="m">
    <Flex direction="column" grow>
      <Heading size="l">
        <Color color="violet">mStudio Extension</Color>{" "}
        selber entwickeln
      </Heading>
      <Text>
        <strong>
          <Color>
            Veröffentliche{" "}
            <Color color="violet">eigene Features</Color> im
            mStudio
          </Color>
        </strong>
      </Text>
    </Flex>
    <Link target="_blank" href="#" color="dark">
      Contributor Landingpage
    </Link>
  </Flex>
</AccentBox>;
