import {
  Flex,
  Breadcrumb,
  Link,
  Heading,
  LayoutCard,
  TabNavigation,
  Section,
  Text,
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
  <LayoutCard>
    <TabNavigation aria-label="E-Mail-Navigation">
      <Link href="#" aria-current="page">
        E-Mail-Adressen
      </Link>
      <Link href="#">Postausgänge</Link>
      <Link href="#">Archivierung</Link>
    </TabNavigation>
    <Section>
      <Text>
        Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Cumque eius quam quas vel voluptas, ullam
        aliquid fugit. Voluptate harum accusantium rerum
        ullam modi blanditiis vitae, laborum ea tempore,
        dolore voluptas. Earum pariatur, similique corrupti
        id officia perferendis. Labore, similique. Earum,
        quas in. At dolorem corrupti blanditiis nulla
        deserunt laborum! Corrupti delectus aspernatur nihil
        nulla obcaecati ipsam porro sequi rem? Quam.
      </Text>
    </Section>
  </LayoutCard>
</Flex>;
