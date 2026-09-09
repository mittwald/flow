import {
  ActionGroup,
  Button,
  ContextMenu,
  ContextMenuTrigger,
  Heading,
  IconChevronDown,
  IconEmail,
  IconForwardAddress,
  IconUpload,
  LayoutCard,
  MenuItem,
  Section,
  Text,
} from "@mittwald/flow-react-components";

export default () => (
  <LayoutCard>
    <Section>
      <Heading>E-Mail-Adressen</Heading>
      <Text>
        Es gibt drei Wege, eine Adresse anzulegen – deshalb
        steht hinter dem Anlegen-Button ein Menü statt einer
        einzelnen Aktion.
      </Text>
      <ActionGroup>
        <ContextMenuTrigger>
          <Button>
            <Text>Anlegen</Text>
            <IconChevronDown />
          </Button>
          <ContextMenu>
            <MenuItem>
              <IconEmail />
              <Text>Postfach anlegen</Text>
            </MenuItem>
            <MenuItem>
              <IconForwardAddress />
              <Text>Weiterleitung einrichten</Text>
            </MenuItem>
            <MenuItem>
              <IconUpload />
              <Text>Adressen aus CSV importieren</Text>
            </MenuItem>
          </ContextMenu>
        </ContextMenuTrigger>
      </ActionGroup>
    </Section>
  </LayoutCard>
);
