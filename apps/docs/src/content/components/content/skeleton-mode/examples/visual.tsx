import {
  ActionGroup,
  AlertBadge,
  Avatar,
  Badge,
  Button,
  CopyButton,
  Flex,
  Heading,
  IconDomain,
  Image,
  Initials,
  Link,
  Section,
  SkeletonMode,
  Text,
} from "@mittwald/flow-react-components";

<SkeletonMode>
  <Section>
    <Heading>
      Webshop Relaunch
      <Badge color="green">Neu</Badge>
    </Heading>
    <Flex gap="m" align="center">
      <Avatar>
        <Initials>Max Mustermann</Initials>
      </Avatar>
      <Text>Max Mustermann ist Projektinhaber.</Text>
    </Flex>
    <Flex gap="m" align="center">
      <IconDomain />
      <Text>webshop.example-domain.de</Text>
      <CopyButton text="webshop.example-domain.de" />
      <AlertBadge status="warning">
        Zertifikat läuft ab
      </AlertBadge>
    </Flex>
    <Image
      src="https://flow.mittwald.de/assets/mittwald_logo_rgb.jpg"
      alt="mittwald"
      width={200}
      height={100}
    />
    <ActionGroup>
      <Link href="#">
        <Button color="secondary" variant="soft">
          Zum Projekt
        </Button>
      </Link>
      <Button color="primary">Speichern</Button>
    </ActionGroup>
  </Section>
</SkeletonMode>;
