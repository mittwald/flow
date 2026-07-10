import {
  AlertBadge,
  AlertIcon,
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
    <AlertBadge status="warning">2</AlertBadge>
  </Link>
</HorizontalNavigation>;
