import {
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
  TextField,
  useOverlayController,
  Text,
  Action,
} from "@mittwald/flow-react-components";

export default () => {
  const modalController = useOverlayController("Modal");

  return (
    <>
      <ContextMenuTrigger>
        <Button variant="plain" color="secondary">
          <IconContextMenu />
        </Button>
        <ContextMenu>
          <MenuItem
            onAction={() => {
              modalController.open();
            }}
          >
            <IconEdit />
            <Text>Bearbeiten</Text>
          </MenuItem>
        </ContextMenu>
      </ContextMenuTrigger>
      <Modal controller={modalController}>
        <Heading>Bearbeiten</Heading>
        <Content>
          <TextField>
            <Label>Name</Label>
          </TextField>
        </Content>
        <ActionGroup>
          <Action closeOverlay="Modal">
            <Button color="accent">Speichern</Button>
            <Button color="secondary" variant="soft">
              Abbrechen
            </Button>
          </Action>
        </ActionGroup>
      </Modal>
    </>
  );
};
