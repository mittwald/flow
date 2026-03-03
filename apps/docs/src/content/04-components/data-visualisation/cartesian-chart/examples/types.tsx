import {
  Area,
  CartesianChart,
  CartesianGrid,
  Line,
  XAxis,
  YAxis,
} from "@mittwald/flow-react-components";

export default () => {
  const data = [
    {
      Zeit: "A",
      A: 40,
      B: 45,
    },
    {
      Zeit: "B",
      A: 32,
      B: 35,
    },
    {
      Zeit: "C",
      A: 20,
      B: 78,
    },
    {
      Zeit: "D",
      A: 27,
      B: 39,
    },
  ];
  return (
    <Row>
      <CartesianChart flexGrow data={data} height="300px">
        <CartesianGrid />
        <Area dataKey="A" />
        <Area dataKey="B" color="palatinate-blue" />
        <XAxis dataKey="Zeit" />
        <YAxis domain={[0, 100]} unit=" %" />
      </CartesianChart>
      <CartesianChart flexGrow data={data} height="300px">
        <CartesianGrid />
        <Line dataKey="A" />
        <Line dataKey="B" color="palatinate-blue" />
        <XAxis dataKey="Zeit" />
        <YAxis domain={[0, 100]} unit=" %" />
      </CartesianChart>
      <CartesianChart flexGrow data={data} height="300px">
        <CartesianGrid />
        <Area dataKey="A" />
        <Line dataKey="B" color="palatinate-blue" />
        <XAxis dataKey="Zeit" />
        <YAxis domain={[0, 100]} unit=" %" />
      </CartesianChart>
    </Row>
  );
};
