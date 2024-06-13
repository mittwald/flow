import Button from "@mittwald/flow-react-components/Button";
import TextField from "@mittwald/flow-react-components/TextField";
import { IconCat, IconDog } from "@tabler/icons-react";
import Icon from "@mittwald/flow-react-components/Icon";

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
</Row>;
