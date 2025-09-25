import { DonutChart } from "@mittwald/flow-react-components";

<Row>
  <DonutChart
    aria-label="Auslastung"
    value={30}
    status="success"
  />
  <DonutChart aria-label="Auslastung" value={30} />
  <DonutChart
    aria-label="Auslastung"
    value={80}
    status="warning"
  />
  <DonutChart
    aria-label="Auslastung"
    value={95}
    status="danger"
  />
</Row>;
