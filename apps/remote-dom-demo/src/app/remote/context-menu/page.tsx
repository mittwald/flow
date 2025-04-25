"use client";
import {
  Button,
  Content,
  ContextMenu,
  ContextMenuTrigger,
  Header,
  Heading,
  IconApp,
  MenuItem,
  Section,
  Text,
} from "@mittwald/flow-remote-react-components";

export default function Page() {
  return (
    <Section>
      <Header>
        <Heading>Heading</Heading>
        <ContextMenuTrigger>
          <Button>Open menu</Button>
          <ContextMenu onAction={(item) => console.log(item)}>
            <MenuItem>
              <IconApp />
              <Text>Test</Text>
            </MenuItem>
            <MenuItem>Test</MenuItem>
            <MenuItem>Test</MenuItem>
            <MenuItem>Test</MenuItem>
          </ContextMenu>
        </ContextMenuTrigger>
      </Header>
      <Content>
        <ContextMenuTrigger>
          <Button>Open menu</Button>
          <ContextMenu onAction={(item) => console.log(item)}>
            <MenuItem>
              <IconApp />
              <Text>Test</Text>
            </MenuItem>
            <MenuItem>Test</MenuItem>
            <MenuItem>Test</MenuItem>
            <MenuItem>Test</MenuItem>
          </ContextMenu>
        </ContextMenuTrigger>
      </Content>
    </Section>
  );
}
