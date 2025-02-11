import { Button } from "@mittwald/flow-react-components";
import {
  ContextMenu,
  ContextMenuTrigger,
  MenuItem,
} from "@mittwald/flow-react-components";
import { Section } from "@mittwald/flow-react-components";
import { Avatar } from "@mittwald/flow-react-components";
import { Initials } from "@mittwald/flow-react-components";
import { IconCamera } from "@mittwald/flow-react-components";
import { Heading } from "@mittwald/flow-react-components";
import { Separator } from "@mittwald/flow-react-components";
import { Text } from "@mittwald/flow-react-components";

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
