import { Link } from "@mittwald/flow-react-components";
import { Button } from "@mittwald/flow-react-components";
import { IconSearch } from "@mittwald/flow-react-components";
import { HeaderNavigation } from "@mittwald/flow-react-components";

<HeaderNavigation
  aria-label="Header navigation"
  color="dark"
>
  <Link href="#">Getting startet</Link>
  <Link href="#" aria-current="page">
    Components
  </Link>
  <Button>
    <IconSearch />
  </Button>
</HeaderNavigation>;
