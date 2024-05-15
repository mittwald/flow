import Button from "@mittwald/flow-react-components/Button";
import HeaderNavigation from "@mittwald/flow-react-components/HeaderNavigation";
import {
  IconMenu,
  IconSearch,
  IconSupport,
} from "@mittwald/flow-react-components/Icons";
import LayoutCard from "@mittwald/flow-react-components/LayoutCard";
import Heading from "@mittwald/flow-react-components/Heading";
import Text from "@mittwald/flow-react-components/Text";

<Column>
  <HeaderNavigation
    aria-label="Header navigation"
    inverse
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
  <LayoutCard style={{ width: "100%" }}>
    <Heading>Projekte</Heading>
    <Text>...</Text>
  </LayoutCard>
</Column>;
