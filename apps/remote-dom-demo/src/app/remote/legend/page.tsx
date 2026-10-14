"use client";
import {
  Flex,
  Heading,
  Legend,
  LegendItem,
  SkeletonMode,
} from "@mittwald/flow-remote-react-components";

export default function Page() {
  return (
    <Flex direction="column" gap="l">
      <Heading>Categorical and custom colors</Heading>
      <Legend>
        <LegendItem color="sea-green">Webspace</LegendItem>
        <LegendItem color="palatinate-blue">Datenbanken</LegendItem>
        <LegendItem color="tangerine">E-Mail</LegendItem>
        <LegendItem color="#555">Sonstiges</LegendItem>
      </Legend>

      <Heading>In SkeletonMode</Heading>
      <SkeletonMode>
        <Legend>
          <LegendItem color="sea-green">Webspace</LegendItem>
          <LegendItem color="palatinate-blue">Datenbanken</LegendItem>
        </Legend>
      </SkeletonMode>
    </Flex>
  );
}
