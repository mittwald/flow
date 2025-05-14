import {
  Area,
  AreaChart,
  type AreaChartEmptyViewProps,
  CartesianGrid,
  ChartLegend,
  ChartTooltip,
  Flex,
  Heading,
  IconDanger,
  IconMonitoring,
  IllustratedMessage,
  Link,
  XAxis,
  YAxis,
} from "@mittwald/flow-react-components";
import type { FC } from "react";

export default () => {
  const EmptyView: FC<AreaChartEmptyViewProps> = (
    props,
  ) => {
    if (props.data === undefined) {
      return (
        <IllustratedMessage color="danger">
          <IconDanger />
          <Heading>Laden der Daten fehlgeschlagen</Heading>
          <Link>Neu laden</Link>
        </IllustratedMessage>
      );
    }

    return (
      <IllustratedMessage>
        <IconMonitoring />
        <Heading>Keine Daten verfügbar</Heading>
      </IllustratedMessage>
    );
  };

  const Chart: FC<AreaChartEmptyViewProps> = (props) => {
    return (
      <AreaChart
        emptyView={EmptyView}
        height="300px"
        flexGrow
        {...props}
      >
        <CartesianGrid />
        <Area dataKey="firstKey" />
        <Area dataKey="secondKey" color="palatinate-blue" />
        <Area dataKey="thirdKey" color="tangerine" />
        <XAxis dataKey="name" />
        <YAxis interval="equidistantPreserveStart" />
        <ChartTooltip />
        <ChartLegend />
      </AreaChart>
    );
  };

  return (
    <Flex direction="row" grow>
      <Chart />
      <Chart data={[]} />
    </Flex>
  );
};
