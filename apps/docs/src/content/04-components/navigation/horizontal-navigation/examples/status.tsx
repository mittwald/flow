import {
  AlertIcon,
  Badge,
  HorizontalNavigation,
  Link,
} from "@mittwald/flow-react-components";

<HorizontalNavigation aria-label="Projekt-Navigation">
  <Link href="#" aria-current="page">
    Dashboard
  </Link>
  <Link href="#">
    Speicherplatz
    <AlertIcon status="danger" />
  </Link>
  <Link href="#">
    Backups
    <Badge color="violet">Neu</Badge>
  </Link>
</HorizontalNavigation>;
