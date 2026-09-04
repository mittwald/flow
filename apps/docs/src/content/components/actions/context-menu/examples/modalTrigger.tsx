import {
  Action,
  ActionGroup,
  Button,
  Content,
  ContextMenu,
  ContextMenuTrigger,
  Heading,
  IconContextMenu,
  IconEdit,
  Label,
  MenuItem,
  Modal,
  ModalTrigger,
  Text,
  TextField,
} from "@mittwald/flow-react-components";

export default () => (
  <ContextMenuTrigger>
    <Button variant="plain" color="secondary">
      <IconContextMenu />
    </Button>
    <ContextMenu>
      <ModalTrigger>
        <Modal>
          <Heading>Bearbeiten</Heading>
          <Content>
            <TextField>
              <Label>Name</Label>
            </TextField>
          </Content>
          <ActionGroup>
            <Action closeModal>
              <Button color="success">Speichern</Button>
              <Button color="secondary" variant="soft">
                Abbrechen
              </Button>
            </Action>
          </ActionGroup>
        </Modal>
        <MenuItem>
          <IconEdit />
          <Text>Bearbeiten</Text>
        </MenuItem>
      </ModalTrigger>
    </ContextMenu>
  </ContextMenuTrigger>
);
