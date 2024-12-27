import { Button } from "@mittwald/flow-react-components/Button";
import ContextMenu, {
  ContextMenuTrigger,
  MenuItem,
} from "@mittwald/flow-react-components/ContextMenu";
import { Section } from "@mittwald/flow-react-components/Section";
import { Avatar } from "@mittwald/flow-react-components/Avatar";
import { Initials } from "@mittwald/flow-react-components/Initials";
import { IconCamera } from "@mittwald/flow-react-components/Icons";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { Separator } from "@mittwald/flow-react-components/Separator";
import { Text } from "@mittwald/flow-react-components/Text";

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
