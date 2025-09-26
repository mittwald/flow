import {
  Button,
  Icon,
  TextField,
} from "@mittwald/flow-react-components";
import { IconCat, IconDog } from "@tabler/icons-react";

<Row>
  <TextField value="Suche" aria-label="Suche" />
  <Button variant="plain" aria-label="Katze">
    <Icon>
      <IconCat />
    </Icon>
  </Button>
  <Button variant="plain" aria-label="Hund">
    <Icon>
      <IconDog />
    </Icon>
  </Button>
  <Button variant="outline" aria-label="Hund">
    <Icon>
      <IconDog />
    </Icon>
  </Button>
</Row>;
