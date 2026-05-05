import {
  Flex,
  Breadcrumb,
  Link,
  Heading,
  LayoutCard,
  Tabs,
  Tab,
  TabTitle,
  Content,
} from "@mittwald/flow-react-components";

<Flex direction="column" gap="m">
  <Breadcrumb color="light">
    <Link>Projekt</Link>
    <Link>E-Mails</Link>
    <Link>E-Mail-Adresse</Link>
  </Breadcrumb>
  <Heading level={1} color="light">
    mail@meinprojekt.de
  </Heading>
  <LayoutCard>
    <Tabs>
      <Tab>
        <TabTitle>E-Mail-Adressen</TabTitle>
        <Content>
          Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Cumque eius quam quas vel voluptas, ullam
          aliquid fugit. Voluptate harum accusantium rerum
          ullam modi blanditiis vitae, laborum ea tempore,
          dolore voluptas. Earum pariatur, similique
          corrupti id officia perferendis. Labore,
          similique. Earum, quas in. At dolorem corrupti
          blanditiis nulla deserunt laborum! Corrupti
          delectus aspernatur nihil nulla obcaecati ipsam
          porro sequi rem? Quam.
        </Content>
      </Tab>
      <Tab>
        <TabTitle>Postausgänge</TabTitle>
        <Content>
          Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Cumque eius quam quas vel voluptas, ullam
          aliquid fugit. Voluptate harum accusantium rerum
          ullam modi blanditiis vitae, laborum ea tempore,
          dolore voluptas. Earum pariatur, similique
          corrupti id officia perferendis. Labore,
          similique. Earum, quas in. At dolorem corrupti
          blanditiis nulla deserunt laborum! Corrupti
          delectus aspernatur nihil nulla obcaecati ipsam
          porro sequi rem? Quam.
        </Content>
      </Tab>
      <Tab>
        <TabTitle>Archivierung</TabTitle>
        <Content>
          Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Cumque eius quam quas vel voluptas, ullam
          aliquid fugit. Voluptate harum accusantium rerum
          ullam modi blanditiis vitae, laborum ea tempore,
          dolore voluptas. Earum pariatur, similique
          corrupti id officia perferendis. Labore,
          similique. Earum, quas in. At dolorem corrupti
          blanditiis nulla deserunt laborum! Corrupti
          delectus aspernatur nihil nulla obcaecati ipsam
          porro sequi rem? Quam.
        </Content>
      </Tab>
    </Tabs>
  </LayoutCard>
</Flex>;
