/** @jsxImportSource @/app/remote-vue/_lib */
import {
  Flex,
  Heading,
  Legend,
  LegendItem,
  SkeletonMode,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent } from "vue";

/** The Vue counterpart of `/remote/legend`. */
export const LegendDemo = defineComponent({
  name: "LegendDemo",
  setup: () => () => (
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
  ),
});
