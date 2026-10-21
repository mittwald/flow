/** @jsxImportSource @/app/remote-vue/_lib */
import { ComponentGroupPage } from "@/app/remote-vue/_demos/components/lib/ComponentGroupPage";
import {
  Action,
  ActionGroup,
  Button,
  Content,
  ContextMenu,
  ContextMenuTrigger,
  CopyButton,
  Heading,
  IconApp,
  MenuItem,
  Modal,
  ModalTrigger,
  Section,
  Text,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent, ref } from "vue";

/** The Vue counterpart of `/remote/components/actions`. */
export const ActionsDemo = defineComponent({
  name: "ActionsDemo",
  setup() {
    const torpedoes = ref(0);
    const stationAction = ref<string>();

    return () => (
      <ComponentGroupPage title="Actions">
        <Section>
          <Heading level={3}>Action</Heading>
          {/* The Vue `Action` has no `actionConfirm` modal, so a
              `ModalTrigger` asks for confirmation instead. */}
          <ModalTrigger>
            <Button color="danger">Destroy the Death Star</Button>
            <Modal>
              <Heading>Destroy the Death Star</Heading>
              <Content>
                Once the Death Star is destroyed, it cannot be rebuilt.
              </Content>
              <ActionGroup>
                <Action closeModal>
                  <Action onAction={() => console.log("Death Star destroyed")}>
                    <Button color="danger">Fire superlaser</Button>
                  </Action>
                  <Button color="secondary" variant="soft">
                    Cancel
                  </Button>
                </Action>
              </ActionGroup>
            </Modal>
          </ModalTrigger>
        </Section>

        <Section>
          <Heading level={3}>ActionGroup</Heading>
          <ActionGroup>
            <Button color="success">Create squadron</Button>
            <Button color="secondary" variant="soft">
              Cancel
            </Button>
          </ActionGroup>
        </Section>

        <Section>
          <Heading level={3}>Button</Heading>
          <Button onPress={() => torpedoes.value++}>Fire proton torpedo</Button>
          <Text>Torpedoes fired: {torpedoes.value}</Text>
        </Section>

        <Section>
          <Heading level={3}>ContextMenu</Heading>
          <ContextMenuTrigger>
            <Button>Station actions</Button>
            <ContextMenu
              onAction={(key: unknown) => (stationAction.value = String(key))}
            >
              <MenuItem id="fire">
                <IconApp />
                <Text>Fire superlaser</Text>
              </MenuItem>
              <MenuItem id="rotate">Rotate station</MenuItem>
              <MenuItem id="scan">Scan sector</MenuItem>
            </ContextMenu>
          </ContextMenuTrigger>
          <Text>Last action: {stationAction.value ?? "–"}</Text>
        </Section>

        <Section>
          <Heading level={3}>CopyButton</Heading>
          <CopyButton text="ssh://rebelbase.org" />
        </Section>
      </ComponentGroupPage>
    );
  },
});
