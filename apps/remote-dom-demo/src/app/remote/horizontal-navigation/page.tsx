"use client";
import {
  AlertBadge,
  AlertIcon,
  Content,
  Header,
  Heading,
  HorizontalNavigation,
  Link,
  Section,
  Text,
} from "@mittwald/flow-remote-react-components";

export default function Page() {
  return (
    <Section>
      <Header>
        <Heading>Horizontal Navigation</Heading>
      </Header>
      <Content>
        <Text>
          Links that do not fit into the available width are collapsed into a
          context menu. Resize the browser window to see the overflow behavior.
        </Text>

        <HorizontalNavigation aria-label="Project navigation">
          <Link href="#dashboard">Dashboard</Link>
          <Link href="#domains" aria-current="page">
            Domains
          </Link>
          <Link href="#mail">Mail</Link>
          <Link href="#databases">Databases</Link>
          <Link href="#storage">
            Storage
            <AlertIcon status="danger" />
          </Link>
          <Link href="#backups">
            Backups
            <AlertBadge status="warning">2</AlertBadge>
          </Link>
          <Link href="#cronjobs">Cronjobs</Link>
          <Link href="#ssh-sftp">SSH/SFTP</Link>
          <Link href="#settings">Settings</Link>
        </HorizontalNavigation>
      </Content>
    </Section>
  );
}
