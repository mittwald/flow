import { Button } from "@mittwald/flow-react-components";
import { HeaderNavigation } from "@mittwald/flow-react-components";
import {
  IconMenu,
  IconSearch,
  IconSupport,
} from "@mittwald/flow-react-components";
import { LayoutCard } from "@mittwald/flow-react-components";
import { Heading } from "@mittwald/flow-react-components";
import { Text } from "@mittwald/flow-react-components";
import { Section } from "@mittwald/flow-react-components";

<Section style={{ height: "100%" }}>
  <HeaderNavigation
    aria-label="Header navigation"
    color="light"
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
  <Button color="accent">Projekt anlegen</Button>
  <LayoutCard style={{ width: "100%", flexGrow: "1" }}>
    <Heading>Projekte</Heading>
    <Text>...</Text>
  </LayoutCard>
</Section>;
