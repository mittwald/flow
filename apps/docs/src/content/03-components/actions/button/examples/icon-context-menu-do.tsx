import { Button } from "@mittwald/flow-react-components";
import { Text } from "@mittwald/flow-react-components";
import {
  ContextMenu,
  ContextMenuTrigger,
} from "@mittwald/flow-react-components";
import { MenuItem } from "@mittwald/flow-react-components";
import {
  IconChevronDown,
  IconEmail,
} from "@mittwald/flow-react-components";
import { IconAt } from "@tabler/icons-react";
import { Icon } from "@mittwald/flow-react-components";

<ContextMenuTrigger>
  <Button color="accent">
    <Text>E-Mail-Addresse anlegen</Text>
    <IconChevronDown />
  </Button>
  <ContextMenu>
    <MenuItem id="1">
      <Icon>
        <IconAt />
      </Icon>
      <Text>Weiterleitungsaddresse</Text>
    </MenuItem>
    <MenuItem id="2">
      <IconEmail />
      <Text>E-Mail-Adresse</Text>
    </MenuItem>
  </ContextMenu>
</ContextMenuTrigger>;
