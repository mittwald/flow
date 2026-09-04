import {
  DatePicker,
  Flex,
  Header,
  Heading,
  Label,
  LayoutCard,
  Option,
  Section,
  Select,
  Switch,
  typedCartesianChart,
} from "@mittwald/flow-react-components";

export default () => {
  const Chart = typedCartesianChart<{
    Zeit: string;
    Maximum: number;
    Durchschnitt: number;
  }>();

  const data = [
    { Zeit: "00:00", Maximum: 12, Durchschnitt: 4 },
    { Zeit: "04:00", Maximum: 18, Durchschnitt: 6 },
    { Zeit: "08:00", Maximum: 47, Durchschnitt: 21 },
    { Zeit: "12:00", Maximum: 63, Durchschnitt: 34 },
    { Zeit: "16:00", Maximum: 55, Durchschnitt: 29 },
    { Zeit: "20:00", Maximum: 24, Durchschnitt: 11 },
  ];

  return (
    <Flex direction="column" gap="m">
      <Heading level={1} color="dark">
        Monitoring
      </Heading>

      <LayoutCard>
        <Section>
          <Header>
            <Heading>Auslastung</Heading>
            <Switch>
              <Label>Logarithmische Darstellung</Label>
            </Switch>
          </Header>

          <Flex direction="row" gap="m" wrap="wrap">
            <Select defaultSelectedKey="tag">
              <Label optional={false}>Intervall</Label>
              <Option value="tag">Ein Tag</Option>
              <Option value="woche">Eine Woche</Option>
              <Option value="monat">Ein Monat</Option>
            </Select>
            <DatePicker>
              <Label optional={false}>Datum</Label>
            </DatePicker>
          </Flex>

          <Heading level={3}>vCPU</Heading>
          <Chart.Chart data={data}>
            <Chart.Area dataKey="Maximum" unit=" %" />
            <Chart.Area
              dataKey="Durchschnitt"
              color="palatinate-blue"
              unit=" %"
            />
            <Chart.XAxis dataKey="Zeit" />
            <Chart.YAxis domain={[0, 100]} unit=" %" />
            <Chart.Grid />
            <Chart.Legend />
            <Chart.Tooltip />
          </Chart.Chart>

          <Heading level={3}>RAM</Heading>
          <Chart.Chart data={data}>
            <Chart.Area dataKey="Maximum" unit=" %" />
            <Chart.Area
              dataKey="Durchschnitt"
              color="palatinate-blue"
              unit=" %"
            />
            <Chart.XAxis dataKey="Zeit" />
            <Chart.YAxis domain={[0, 100]} unit=" %" />
            <Chart.Grid />
            <Chart.Legend />
            <Chart.Tooltip />
          </Chart.Chart>
        </Section>
      </LayoutCard>
    </Flex>
  );
};
