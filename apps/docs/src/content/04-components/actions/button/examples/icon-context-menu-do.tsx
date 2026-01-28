import {
  Button,
  ContextMenu,
  ContextMenuTrigger,
  Icon,
  IconChevronDown,
  IconEmail,
  MenuItem,
  Text,
} from "@mittwald/flow-react-components";
import { IconAt } from "@tabler/icons-react";

<ContextMenuTrigger>
  <Button color="accent">
    <Text>E-Mail-Addresse anlegen</Text>
    <IconChevronDown />
  </Button>
  <ContextMenu aria-label="E-Mail-Addresse anlegen">
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
