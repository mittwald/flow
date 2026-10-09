import {
  Button,
  HeaderNavigation,
  Icon,
  IconSearch,
  Link,
} from "@mittwald/flow-react-components";
import { IconBrandGithub } from "@tabler/icons-react";

<HeaderNavigation aria-label="Header navigation">
  <Link href="#">Getting started</Link>
  <Link href="#" aria-current="page">
    Components
  </Link>
  <Link
    href="https://github.com/mittwald/flow"
    target="_blank"
    aria-label="GitHub"
  >
    <Button>
      <Icon>
        <IconBrandGithub />
      </Icon>
    </Button>
  </Link>
  <Button aria-label="Suche">
    <IconSearch />
  </Button>
</HeaderNavigation>;
