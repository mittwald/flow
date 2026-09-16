<script>
  import {
    CartesianChart,
    CartesianGrid,
    ChartLegend,
    ChartTooltip,
    Heading,
    Line,
    Section,
    XAxis,
    YAxis,
  } from "@mittwald/flow-remote-svelte-components";

  const data = [
    { month: "Jan", xWings: 12, tieFighters: 40 },
    { month: "Feb", xWings: 18, tieFighters: 38 },
    { month: "Mar", xWings: 24, tieFighters: 31 },
    { month: "Apr", xWings: 21, tieFighters: 27 },
    { month: "May", xWings: 30, tieFighters: 22 },
  ];
</script>

<Section>
  <Heading>Fleet strength</Heading>
  <CartesianChart {data} aria-label="Fleet strength over time">
    <CartesianGrid />
    <XAxis dataKey="month" />
    <YAxis />
    <ChartTooltip />
    <ChartLegend />
    <Line dataKey="xWings" name="X-wings" />
    <Line dataKey="tieFighters" name="TIE fighters" />
  </CartesianChart>
</Section>
