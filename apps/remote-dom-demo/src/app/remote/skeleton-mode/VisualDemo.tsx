"use client";
import {
  ActionGroup,
  AlertBadge,
  Avatar,
  Badge,
  Button,
  ContextMenu,
  ContextMenuTrigger,
  CopyButton,
  CounterBadge,
  Flex,
  Heading,
  IconDomain,
  IconNotification,
  Image,
  Initials,
  Link,
  MenuItem,
  Text,
} from "@mittwald/flow-remote-react-components";

export const VisualDemo = () => (
  <>
    <Heading level={3}>
      Projektinhaber
      <Badge color="green">Neu</Badge>
      <ContextMenuTrigger>
        <Button variant="plain" color="secondary">
          Aktionen
        </Button>
        <ContextMenu>
          <MenuItem>Entfernen</MenuItem>
        </ContextMenu>
      </ContextMenuTrigger>
    </Heading>
    <Flex gap="m" align="center">
      <Avatar>
        <Initials>Max Mustermann</Initials>
      </Avatar>
      <Text>Max Mustermann</Text>
      <AlertBadge status="warning">Zertifikat läuft ab</AlertBadge>
    </Flex>
    <Flex gap="m" align="center">
      <IconDomain />
      <Text>webshop.example-domain.de</Text>
      <CopyButton text="webshop.example-domain.de" />
      <Button variant="plain" color="secondary" aria-label="Benachrichtigungen">
        <IconNotification />
        <CounterBadge count={3} />
      </Button>
    </Flex>
    <Image
      src="https://flow.mittwald.de/assets/mittwald_logo_rgb.jpg"
      alt="mittwald"
      width={200}
      height={100}
    />
    <ActionGroup>
      <Link href="#">
        <Button color="secondary" variant="soft">
          Zum Projekt
        </Button>
      </Link>
      <Button color="primary">Speichern</Button>
    </ActionGroup>
  </>
);

export default VisualDemo;
