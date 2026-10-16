<script>
  import {
    Area,
    Bar,
    CartesianChart,
    CartesianGrid,
    ChartTooltip,
    Heading,
    IconMonitoring,
    IllustratedMessage,
    XAxis,
    YAxis,
  } from "@mittwald/flow-remote-svelte-components";

  const data = [
    { time: "0:00", Shields: 40, Hull: 24 },
    { time: "1:00", Shields: 30, Hull: 13 },
    { time: "2:00", Shields: 20, Hull: 78 },
    { time: "3:00", Shields: 27, Hull: 39 },
  ];

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
</script>

<!--
  `emptyView` is a `ReactNode` prop, so the generator made it a slot — here a
  snippet, which travels as a slotted child. As a remote property the subtree
  would be dropped by structured clone.
-->
{#snippet emptyView()}
  <IllustratedMessage>
    <IconMonitoring />
    <Heading>No data available</Heading>
  </IllustratedMessage>
{/snippet}

{#snippet areaChart(chartData)}
  <CartesianChart data={chartData} height="300px" {emptyView}>
    <CartesianGrid />
    <Area dataKey="Shields" />
    <Area dataKey="Hull" color="palatinate-blue" />
    <XAxis dataKey="time" />
    <YAxis domain={[0, 100]} unit="%" />
    <!--
      The async formatter is the point of this one: a function prop is a thread
      proxy, so calling it is a round trip and the host always receives a
      Promise. Flow types these `Promise<T> | T` and awaits them.
    -->
    <ChartTooltip
      headingFormatter={(v) => `Sync Format: ${v}`}
      formatter={async (value, name, index, unit) => {
        await sleep(3000);
        return `Async Format: ${name}: ${value}${unit ? ` ${unit}` : ""}`;
      }}
    />
  </CartesianChart>
{/snippet}

{#snippet barChart(layout)}
  <CartesianChart {data} height="300px" {layout}>
    <CartesianGrid
      vertical={layout === "vertical"}
      horizontal={layout !== "vertical"}
    />
    <Bar dataKey="Shields" />
    <Bar dataKey="Hull" color="palatinate-blue" />
    {#if layout === "vertical"}
      <XAxis unit="%" />
      <YAxis dataKey="time" />
    {:else}
      <XAxis dataKey="time" />
      <YAxis domain={[0, 100]} unit="%" />
    {/if}
    <ChartTooltip />
  </CartesianChart>
{/snippet}

{@render areaChart(data)}
{@render areaChart(data)}
{@render areaChart([])}
{@render barChart("horizontal")}
{@render barChart("vertical")}
