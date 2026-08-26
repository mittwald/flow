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
  IconPlus,
  MarkdownEditor,
  MenuItem,
  Modal,
  ModalTrigger,
  Text,
} from "@mittwald/flow-react-components";
import { useState } from "react";

export default () => {
  const [value, setValue] = useState(
    "## Support-Antwort\n\nVielen Dank für deine Nachricht.",
  );

  const insertAtEnd = (content: string) => {
    setValue((currentValue) => `${currentValue}${content}`);
  };

  return (
    <MarkdownEditor
      value={value}
      onChange={setValue}
      rows={5}
    >
      <Button
        aria-label="Signatur einfügen"
        onPress={() => {
          insertAtEnd("\n\nViele Grüße\nDein Support-Team");
        }}
      >
        <IconPlus />
      </Button>

      <ContextMenuTrigger>
        <Button aria-label="Textbausteine anzeigen">
          <IconContextMenu />
        </Button>
        <ContextMenu>
          <MenuItem
            onAction={() => {
              insertAtEnd("Hallo {{name}},");
            }}
          >
            Begrüßung einfügen
          </MenuItem>
          <MenuItem
            onAction={() => {
              insertAtEnd(
                "## Nächste Schritte\n\n1. Vertrag prüfen\n2. Rückmeldung geben",
              );
            }}
          >
            Nächste Schritte einfügen
          </MenuItem>
        </ContextMenu>
      </ContextMenuTrigger>

      <ModalTrigger>
        <Button aria-label="Vorlagen anzeigen">
          <IconEdit />
        </Button>
        <Modal>
          <Heading>Vorlage einfügen</Heading>
          <Content>
            <Text>
              Füge einen vorbereiteten Antwortblock in den
              Editor ein.
            </Text>
          </Content>
          <ActionGroup>
            <Action closeModal>
              <Button
                color="success"
                onPress={() => {
                  insertAtEnd(
                    "## Wartungsfenster\n\nDas Wartungsfenster startet morgen um 22:00 Uhr.",
                  );
                }}
              >
                Wartungsfenster einfügen
              </Button>
              <Button color="secondary" variant="soft">
                Abbrechen
              </Button>
            </Action>
          </ActionGroup>
        </Modal>
      </ModalTrigger>
    </MarkdownEditor>
  );
};
