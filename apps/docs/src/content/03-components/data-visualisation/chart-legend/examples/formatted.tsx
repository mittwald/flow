import {
  Area,
  AreaChart,
  ChartLegend,
} from "@mittwald/flow-react-components";

export default () => {
  const mapName = (name: string | number) => {
    switch (name) {
      case "firstKey":
        return "Projektauslastung";
      case "secondKey":
        return "Datenbankauslastung";
      case "thirdKey":
        return "Mailauslastung";
    }
    return "Andere";
  };

  return (
    <div style={{ height: "300px" }}>
      <AreaChart
        data={[
          {
            name: "Tag 1",
            firstKey: 3000,
            secondKey: 1398,
            thirdKey: 2210,
          },
          {
            name: "Tag 2",
            firstKey: 2000,
            secondKey: 9800,
            thirdKey: 2290,
          },
          {
            name: "Tag 3",
            firstKey: 2780,
            secondKey: 3908,
            thirdKey: 2000,
          },
          {
            name: "Tag 4",
            firstKey: 1890,
            secondKey: 4800,
            thirdKey: 2181,
          },
          {
            name: "Tag 5",
            firstKey: 2390,
            secondKey: 3800,
            thirdKey: 2500,
          },
          {
            name: "Tag 6",
            firstKey: 3490,
            secondKey: 4300,
            thirdKey: 2100,
          },
        ]}
      >
        <Area dataKey="firstKey" />
        <Area dataKey="secondKey" color="palatinate-blue" />
        <Area dataKey="thirdKey" color="tangerine" />
        <ChartLegend formatter={(text) => mapName(text)} />
      </AreaChart>
    </div>
  );
};
