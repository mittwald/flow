"use client";
import { useState } from "react";
import { ComponentGroupPage } from "@/app/remote/components/_lib/ComponentGroupPage";
import {
  AlertIcon,
  Breadcrumb,
  Button,
  HeaderNavigation,
  Heading,
  IconSearch,
  IconStar,
  IconStarFilled,
  ItemAction,
  Label,
  Link,
  Navigation,
  NavigationGroup,
  Section,
  TabNavigation,
} from "@mittwald/flow-remote-react-components";

export default function Page() {
  const [isPinned, setIsPinned] = useState(false);

  return (
    <ComponentGroupPage title="Navigation">
      <Section>
        <Heading level={3}>Breadcrumb</Heading>
        <Breadcrumb>
          <Link href="#">Galaxy</Link>
          <Link href="#">Outer Rim</Link>
          <Link href="#">Tatooine</Link>
        </Breadcrumb>
      </Section>

      <Section>
        <Heading level={3}>HeaderNavigation</Heading>
        <HeaderNavigation aria-label="Fleet navigation">
          <Link href="#">Hangar</Link>
          <Link href="#" aria-current="page">
            Fleet
          </Link>
          <Button aria-label="Search">
            <IconSearch />
          </Button>
        </HeaderNavigation>
      </Section>

      <Section>
        <Heading level={3}>Link</Heading>
        <Link href="#">Back to the hangar</Link>
      </Section>

      <Section>
        <Heading level={3}>Navigation</Heading>
        <Navigation aria-label="Station">
          <Link href="#" aria-current="page">
            Bridge
          </Link>
          <NavigationGroup>
            <Label>Decks</Label>
            <Link href="#">
              Hangar
              <ItemAction
                aria-label={isPinned ? "Unpin Hangar" : "Pin Hangar"}
                visibility={isPinned ? "always" : "hover"}
                onPress={() => setIsPinned(!isPinned)}
              >
                {isPinned ? <IconStarFilled /> : <IconStar />}
              </ItemAction>
            </Link>
            <Link href="#">Detention block</Link>
          </NavigationGroup>
        </Navigation>
      </Section>

      <Section>
        <Heading level={3}>TabNavigation</Heading>
        <TabNavigation aria-label="Project navigation">
          <Link href="#">Apps</Link>
          <Link href="#" aria-current="page">
            Container
          </Link>
          <Link href="#">Domains</Link>
          <Link href="#">
            Databases
            <AlertIcon status="warning" />
          </Link>
          <Link href="#">Backups</Link>
        </TabNavigation>
      </Section>
    </ComponentGroupPage>
  );
}
