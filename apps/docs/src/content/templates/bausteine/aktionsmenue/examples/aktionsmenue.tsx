import {
  Button,
  ContextMenu,
  ContextMenuTrigger,
  Flex,
  Heading,
  IconChevronDown,
  IconDelete,
  IconEdit,
  IconExternalLink,
  IconPassword,
  MenuItem,
  Text,
} from "@mittwald/flow-react-components";

export default () => (
  <Flex justify="space-between" align="end">
    <Heading color="dark" level={1}>
      max@mustermann.de
    </Heading>

    <ContextMenuTrigger>
      <Button variant="outline" color="dark">
        <Text>Aktionen</Text>
        <IconChevronDown />
      </Button>
      <ContextMenu placement="bottom end">
        <MenuItem>
          <IconEdit />
          <Text>Bearbeiten</Text>
        </MenuItem>
        <MenuItem>
          <IconPassword />
          <Text>Passwort ändern</Text>
        </MenuItem>
        <MenuItem>
          <IconExternalLink />
          <Text>Im Webmailer öffnen</Text>
        </MenuItem>
        <MenuItem isDisabled>
          <IconDelete />
          <Text>Löschen</Text>
        </MenuItem>
      </ContextMenu>
    </ContextMenuTrigger>
  </Flex>
);
