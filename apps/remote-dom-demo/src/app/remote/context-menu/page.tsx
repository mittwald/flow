"use client";
import {
  Action,
  ActionGroup,
  Button,
  Content,
  ContextMenu,
  ContextMenuTrigger,
  Header,
  Heading,
  IconApp,
  MenuItem,
  Modal,
  ModalTrigger,
  Section,
  Text,
} from "@mittwald/flow-remote-react-components";

export default function Page() {
  return (
    <Section>
      <Header>
        <Heading>Heading</Heading>
        <ModalTrigger>
          <Button>Open modal</Button>
          <Modal>
            <Heading>Modal Heading</Heading>
            <Content>Modal Content</Content>
            <ActionGroup>
              <Action closeOverlay="Modal">
                <Button>Close</Button>
              </Action>
            </ActionGroup>
          </Modal>
        </ModalTrigger>

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
