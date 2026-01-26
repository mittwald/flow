import {
  Button,
  IconFilter,
  IconSorting,
  TextField,
} from "@mittwald/flow-react-components";

<Row>
  <TextField value="Suche" aria-label="Suche" />
  <Button variant="plain" aria-label="Sortierung">
    <IconSorting />
  </Button>
  <Button variant="plain" aria-label="Filter">
    <IconFilter />
  </Button>
  <Button variant="outline" aria-label="Filter">
    <IconFilter />
  </Button>
</Row>;
