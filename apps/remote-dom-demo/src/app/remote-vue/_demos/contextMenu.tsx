/** @jsxImportSource @/app/remote-vue/_lib */
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
} from "@mittwald/flow-remote-vue-components";
import { defineComponent } from "vue";

const StationActions = () => (
  <ContextMenuTrigger>
    <Button>Station actions</Button>
    <ContextMenu onAction={(item: unknown) => console.log(item)}>
      <MenuItem>
        <IconApp />
        <Text>Fire superlaser</Text>
      </MenuItem>
      <MenuItem>Rotate station</MenuItem>
      <MenuItem>Scan sector</MenuItem>
      <MenuItem>Self-destruct</MenuItem>
    </ContextMenu>
  </ContextMenuTrigger>
);

/** The Vue counterpart of `/remote/context-menu`. */
export const ContextMenuDemo = defineComponent({
  name: "ContextMenuDemo",
  setup: () => () => (
    <Section>
      <Header>
        <Heading>Death Star</Heading>
        <ModalTrigger>
          <Button>Battle station controls</Button>
          <Modal>
            <Heading>Battle station controls</Heading>
            <Content>Command the Death Star's systems.</Content>
            <ActionGroup>
              <Action closeModal>
                <Button>Close</Button>
              </Action>
            </ActionGroup>
          </Modal>
        </ModalTrigger>
        <StationActions />
      </Header>
      <Content>
        <StationActions />
      </Content>
    </Section>
  ),
});
