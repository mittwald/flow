import {
  AccentBox,
  LayoutCard,
  Link,
} from "@mittwald/flow-react-components";

<Row>
  <Link href="#" target="_blank">
    <AccentBox backgroundColor="blue">
      Verlinkte AccentBox
    </AccentBox>
  </Link>
  <Link href="#" target="_blank">
    <LayoutCard>
      <AccentBox backgroundColor="blue">
        Verlinkte AccentBox in LayoutCard
      </AccentBox>
    </LayoutCard>
  </Link>
</Row>;
