import { Button } from "@mittwald/flow-react-components";
import { TextField } from "@mittwald/flow-react-components";
import {
  IconFilter,
  IconSorting,
} from "@mittwald/flow-react-components";

<Row>
  <TextField value="Suche" />
  <Button variant="plain">
    <IconSorting />
  </Button>
  <Button variant="plain">
    <IconFilter />
  </Button>
  <Button variant="outline">
    <IconFilter />
  </Button>
</Row>;
