import {
  Flex,
  Breadcrumb,
  Link,
  Heading,
  TabNavigation,
} from "@mittwald/flow-react-components";

<Flex direction="column" gap="m">
  <Breadcrumb color="dark">
    <Link>Projekt</Link>
    <Link>E-Mails</Link>
    <Link>E-Mail-Adresse</Link>
  </Breadcrumb>
  <Heading level={1} color="dark">
    mail@meinprojekt.de
  </Heading>
  <TabNavigation aria-label="E-Mail-Navigation">
    <Link href="#" aria-current="page">
      E-Mail-Adressen
    </Link>
    <Link href="#">Postausgänge</Link>
    <Link href="#">Archivierung</Link>
  </TabNavigation>
</Flex>;
