import { DonutChart } from "@mittwald/flow-react-components";

<>
  <DonutChart
    value={30}
    status="success"
    aria-label="Auslastung"
  />
  <DonutChart value={30} aria-label="Auslastung" />
  <DonutChart
    value={80}
    status="warning"
    aria-label="Auslastung"
  />
  <DonutChart
    value={95}
    status="danger"
    aria-label="Auslastung"
  />
</>;
