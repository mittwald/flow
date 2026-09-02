import {
  Button,
  ContextMenu,
  ContextMenuTrigger,
  Heading,
  IconChevronDown,
  IconDomain,
  IconSubdomain,
  IllustratedMessage,
  LayoutCard,
  MenuItem,
  Text,
} from "@mittwald/flow-react-components";

export default () => (
  <LayoutCard>
    <IllustratedMessage>
      <IconDomain />
      <Heading>Domain anlegen</Heading>
      <Text>
        Bevor du eine E-Mail-Adresse anlegen kannst, musst
        du eine Domain zu deinem Projekt hinzufügen.
      </Text>
      <ContextMenuTrigger>
        <Button>
          <Text>Hinzufügen</Text>
          <IconChevronDown />
        </Button>
        <ContextMenu>
          <MenuItem>
            <IconDomain />
            <Text>Domain bestellen</Text>
          </MenuItem>
          <MenuItem>
            <IconSubdomain />
            <Text>Subdomain anlegen</Text>
          </MenuItem>
        </ContextMenu>
      </ContextMenuTrigger>
    </IllustratedMessage>
  </LayoutCard>
);
