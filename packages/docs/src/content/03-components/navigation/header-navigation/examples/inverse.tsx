import Link from "@mittwald/flow-react-components/Link";
import Button from "@mittwald/flow-react-components/Button";
import { IconSearch } from "@mittwald/flow-react-components/Icons";
import HeaderNavigation from "@mittwald/flow-react-components/HeaderNavigation";

<HeaderNavigation aria-label="Header navigation" inverse>
  <Link href="#">Getting startet</Link>
  <Link href="#" aria-current="page">
    Components
  </Link>
  <Button>
    <IconSearch />
  </Button>
</HeaderNavigation>;
