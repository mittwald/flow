import {
  Button,
  HeaderNavigation,
  Heading,
  IconChevronDown,
  IconMenu,
  IconSearch,
  IconSupport,
  LayoutCard,
  Section,
  Text,
} from "@mittwald/flow-react-components";

<Section style={{ height: "100%" }}>
  <HeaderNavigation
    aria-label="Header Navigation"
    color="dark"
    style={{ alignSelf: "flex-end" }}
  >
    <Button>
      <IconSearch />
    </Button>
    <Button>
      <IconSupport />
    </Button>
    <Button>
      <IconMenu />
    </Button>
  </HeaderNavigation>
  <Button color="dark" variant="outline">
    <Text>Aktionen</Text>
    <IconChevronDown />
  </Button>
  <LayoutCard style={{ width: "100%", flexGrow: "1" }}>
    <Heading>Projekte</Heading>
    <Text>...</Text>
  </LayoutCard>
</Section>;
