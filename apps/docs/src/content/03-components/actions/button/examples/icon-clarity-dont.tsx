import {
  Button,
  Icon,
  TextField,
} from "@mittwald/flow-react-components";
import { IconCat, IconDog } from "@tabler/icons-react";

<Row>
  <TextField value="Suche" />
  <Button variant="plain">
    <Icon>
      <IconCat />
    </Icon>
  </Button>
  <Button variant="plain">
    <Icon>
      <IconDog />
    </Icon>
  </Button>
  <Button variant="outline">
    <Icon>
      <IconDog />
    </Icon>
  </Button>
</Row>;
