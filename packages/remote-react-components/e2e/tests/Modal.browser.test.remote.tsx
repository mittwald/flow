import { ActionGroup, Button, Content, Heading, Text } from "../../src/index";
import { Action, Modal, ModalTrigger } from "../../src/index";
import { typedList } from "../../src/index";

const TestModal = (
  <Modal>
    <Heading data-testid="modal-heading">Heading</Heading>
    <Content>
      <Text data-testid="modal-content">Content</Text>
    </Content>
    <ActionGroup>
      <Action closeModal>
        <Button data-testid="close-button">Close</Button>
      </Action>
    </ActionGroup>
  </Modal>
);

export const standard = () => (
  <ModalTrigger>
    <Button data-testid="trigger">Open Modal</Button>
    {TestModal}
  </ModalTrigger>
);

const List = typedList<string>();

export const inList = () => (
  <List.List>
    <List.StaticData data={["Item1"]} />
    <List.Item>
      {() => (
        <List.ItemView>
          <ModalTrigger>
            <Button data-testid="trigger">Open Modal</Button>
            {TestModal}
          </ModalTrigger>
        </List.ItemView>
      )}
    </List.Item>
  </List.List>
);
