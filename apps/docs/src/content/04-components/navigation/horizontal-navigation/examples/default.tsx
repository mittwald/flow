import {
  HorizontalNavigation,
  Link,
  AlertIcon,
} from "@mittwald/flow-react-components";
import React from "react";

<HorizontalNavigation aria-label="Projekt-Navigation">
  <Link href="#">Apps</Link>
  <Link href="#" aria-current="page">
    Container
  </Link>
  <Link href="#">Domains</Link>
  <Link href="#">E-Mails</Link>
  <Link href="#">
    Datenbanken
    <AlertIcon status="warning" />
  </Link>
  <Link href="#">Backups</Link>
</HorizontalNavigation>;
