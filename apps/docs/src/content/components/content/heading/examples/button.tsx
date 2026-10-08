import {
  Badge,
  Button,
  CopyButton,
  Heading,
  IconEdit,
  Section,
} from "@mittwald/flow-react-components";

<Section>
  <Heading>
    mein-shop.de
    <CopyButton text="mein-shop.de" />
  </Heading>
  <Heading level={3}>
    Onlineshop
    <Badge>Produktiv</Badge>
    <Button
      aria-label="Projekt umbenennen"
      variant="plain"
      color="secondary"
    >
      <IconEdit />
    </Button>
  </Heading>
</Section>;
