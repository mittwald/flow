import {
  Avatar,
  Button,
  Flex,
  HeaderNavigation,
  Heading,
  IconSearch,
  Initials,
  Label,
  LayoutCard,
  Link,
  Navigation,
  NavigationGroup,
  IconDashboard,
  IconMonitoring,
  IconApp,
  IconContainer,
  Text,
  ColumnLayout,
} from "@mittwald/flow-react-components";

<Flex direction="column" rowGap="l">
  <Flex justify="end">
    <HeaderNavigation color="light">
      <Link>Dashboard</Link>
      <Link aria-current="page">Projekt</Link>
      <Link>Server</Link>
      <Link>Organisation</Link>
      <Button aria-label="Suche">
        <IconSearch />
      </Button>
      <Button aria-label="Suche">
        <Avatar>
          <Initials>Max Mustermann</Initials>
        </Avatar>
      </Button>
    </HeaderNavigation>
  </Flex>
  <ColumnLayout l={[1, 3]} m={[1, 2]}>
    <LayoutCard>
      <Navigation>
        <Heading>Mein Projekt</Heading>
        <NavigationGroup>
          <Label>Allgemeines</Label>
          <Link aria-current="page">
            <IconDashboard />
            Dashboard
          </Link>
          <Link>
            <IconMonitoring />
            Monitoring
          </Link>
        </NavigationGroup>
        <NavigationGroup>
          <Label>Komponenten</Label>
          <Link>
            <IconApp />
            Apps
          </Link>
          <Link>
            <IconContainer />
            Container
          </Link>
        </NavigationGroup>
      </Navigation>
    </LayoutCard>
    <LayoutCard>
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
    </LayoutCard>
  </ColumnLayout>
</Flex>;
