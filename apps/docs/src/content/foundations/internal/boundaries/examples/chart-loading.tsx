import {
  CartesianChart,
  LoadingSpinner,
  XAxis,
  YAxis,
} from "@mittwald/flow-react-components";

<CartesianChart
  height="300px"
  emptyView={<LoadingSpinner />}
>
  <XAxis />
  <YAxis domain={[0, 100]} unit=" %" />
</CartesianChart>;
