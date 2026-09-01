import {
  LayoutCard,
  TabNavigation,
  Link,
  Section,
  Text,
} from "@mittwald/flow-react-components";

<LayoutCard>
  <TabNavigation aria-label="Projekt-Navigation">
    <Link href="#" aria-current="page">
      Apps
    </Link>
    <Link href="#">Container</Link>
    <Link href="#">Domains</Link>
    <Link href="#">E-Mails</Link>
    <Link href="#">Backups</Link>
  </TabNavigation>
  <Section>
    <Text>
      Der Inhalt der aktiven Seite wird unterhalb der
      TabNavigation in derselben LayoutCard dargestellt.
    </Text>
  </Section>
</LayoutCard>;
