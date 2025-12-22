import {
  Align,
  Avatar,
  Button,
  Content,
  ContextMenu,
  ContextMenuTrigger,
  Header,
  Initials,
  MenuItem,
  Message,
  Text,
} from "@mittwald/flow-react-components";

<Message>
  <Header>
    <ContextMenuTrigger>
      <Button />
      <ContextMenu>
        <MenuItem>Bearbeiten</MenuItem>
        <MenuItem>Löschen</MenuItem>
      </ContextMenu>
    </ContextMenuTrigger>
    <Align>
      <Avatar>
        <Initials>Max Mustermann</Initials>
      </Avatar>
      <Text>
        <strong>Max Mustermann</strong>
        Organisationsinhaber
      </Text>
    </Align>
    <Text>01.09.2024, 12:45</Text>
  </Header>

  <Content>
    <Text>
      Lorem ipsum dolor sit amet, consetetur sadipscing
      elitr, sed diam nonumy eirmod tempor invidunt ut
      labore et dolore magna aliquyam erat, sed diam
      voluptua. At vero eos et accusam et justo duo dolores
      et ea rebum. Stet clita kasd gubergren, no sea
      takimata sanctus est Lorem ipsum dolor sit amet.
    </Text>
  </Content>
</Message>;
