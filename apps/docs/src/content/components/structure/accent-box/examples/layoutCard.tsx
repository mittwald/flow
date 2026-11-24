import {
  AccentBox,
  Color,
  Flex,
  Heading,
  LayoutCard,
  Link,
  Text,
} from "@mittwald/flow-react-components";

<LayoutCard>
  <AccentBox backgroundColor="gradient-navy" color="dark">
    <Flex align="center" wrap="wrap" gap="m">
      <Flex direction="column" grow>
        <Heading size="l">
          <Color color="lilac">mStudio Extension</Color>{" "}
          selber entwickeln
        </Heading>
        <Text>
          <strong>
            Veröffentliche{" "}
            <Color color="lilac">eigene Features</Color> im
            mStudio
          </strong>
        </Text>
      </Flex>
      <Link target="_blank" href="#" color="dark">
        Contributor Landingpage
      </Link>
    </Flex>
  </AccentBox>
</LayoutCard>;
