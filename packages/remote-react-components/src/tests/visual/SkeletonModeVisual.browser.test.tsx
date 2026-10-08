import { crossVersion, testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { skeletonModeSince } from "@/tests/lib/skeletonModeSince";
import gopher from "@/tests/assets/gopher.webp";
import { SkeletonComparison } from "@/tests/lib/SkeletonComparison";

test.skipIf(crossVersion({ below: skeletonModeSince })).each(testEnvironments)(
  "SkeletonMode visual (%s)",
  async ({ testScreenshot, render, components }) => {
    const {
      SkeletonMode,
      Section,
      Heading,
      Text,
      Link,
      Avatar,
      Initials,
      Icon,
      IconDomain,
      IconNotification,
      Image,
      Badge,
      CounterBadge,
      AlertBadge,
      Button,
      CopyButton,
      ContextMenuTrigger,
      ContextMenu,
      MenuItem,
      Flex,
      ColumnLayout,
    } = components;

    await render(
      <SkeletonComparison components={components}>
        <Section>
          <Heading>
            Webshop Relaunch
            <Badge color="green">Neu</Badge>
            <Button variant="soft" color="secondary">
              Bearbeiten
            </Button>
          </Heading>
          <Flex gap="m" align="center">
            <Avatar size="l">
              <Image alt="Max Mustermann" src={gopher} />
            </Avatar>
            <Avatar>
              <Initials>Max Mustermann</Initials>
            </Avatar>
            <Avatar size="s">
              <Icon>
                <IconDomain />
              </Icon>
            </Avatar>
            <Initials>Erika Musterfrau</Initials>
            <Icon>
              <IconDomain />
            </Icon>
            <Icon size="l">
              <IconDomain />
            </Icon>
          </Flex>
          <Flex gap="m" align="center">
            <Badge>PHP 8.4</Badge>
            <Badge onClose={() => undefined}>
              <Text>Tag</Text>
            </Badge>
            <CounterBadge count={3} />
            <CounterBadge count={128} />
            <AlertBadge status="warning">Zertifikat läuft ab</AlertBadge>
          </Flex>
          <ColumnLayout m={[1, 1, 1]}>
            <Image alt="Vorschau" src={gopher} />
            <Flex gap="m" align="center">
              <Image alt="Vorschau" src={gopher} width={160} height={90} />
              <Image
                alt="Vorschau"
                src={gopher}
                height={90}
                withRoundedCorners={false}
              />
            </Flex>
          </ColumnLayout>
          <Flex gap="m" align="center">
            <Button>Speichern</Button>
            <Button variant="outline" color="secondary" size="s">
              Abbrechen
            </Button>
            <Button
              variant="plain"
              color="secondary"
              aria-label="Benachrichtigungen"
            >
              <IconNotification />
              <CounterBadge count={3} />
            </Button>
            <CopyButton text="webshop.example-domain.de" />
            <Link href="#">
              <Button color="secondary" variant="soft">
                Zum Projekt
              </Button>
            </Link>
            <ContextMenuTrigger>
              <Button variant="soft" color="secondary">
                Aktionen
              </Button>
              <ContextMenu>
                <MenuItem>Löschen</MenuItem>
              </ContextMenu>
            </ContextMenuTrigger>
          </Flex>
          <SkeletonMode isEnabled={false}>
            <Flex gap="m" align="center">
              <Badge>Bereits geladen</Badge>
              <Button>Speichern</Button>
            </Flex>
          </SkeletonMode>
        </Section>
      </SkeletonComparison>,
    );

    await testScreenshot("SkeletonMode visual");
  },
);
