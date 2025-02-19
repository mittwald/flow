import {
  Avatar,
  Button,
  ContextMenu,
  ContextMenuTrigger,
  Heading,
  IconCamera,
  Initials,
  MenuItem,
  Section,
  Separator,
  Text,
} from "@mittwald/flow-react-components";

<ContextMenuTrigger>
  <Button>Trigger</Button>
  <ContextMenu selectionMode="navigation">
    <Section>
      <MenuItem>
        <Avatar>
          <Initials>Max Mustermann</Initials>
        </Avatar>
        <IconCamera />
      </MenuItem>
      <Heading>Max Mustermann</Heading>
    </Section>
    <Separator />
    <Section>
      <MenuItem>
        <Text>Settings</Text>
      </MenuItem>
      <MenuItem>
        <Text>Logout</Text>
      </MenuItem>
    </Section>
  </ContextMenu>
</ContextMenuTrigger>;
