import { Message } from "@mittwald/flow-react-components/Message";
import { Header } from "@mittwald/flow-react-components/Header";
import {
  ContextMenu,
  ContextMenuTrigger,
} from "@mittwald/flow-react-components/ContextMenu";
import { Button } from "@mittwald/flow-react-components/Button";
import MenuItem from "@mittwald/flow-react-components/MenuItem";
import { Align } from "@mittwald/flow-react-components/Align";
import { Avatar } from "@mittwald/flow-react-components/Avatar";
import { Initials } from "@mittwald/flow-react-components/Initials";
import { Text } from "@mittwald/flow-react-components/Text";
import { Content } from "@mittwald/flow-react-components/Content";

<Message type="responder">
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
        <b>Max Mustermann</b>
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
