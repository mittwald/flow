import type { Meta, StoryObj } from "@storybook/react";
import SkeletonMode from "../SkeletonMode";
import { Section } from "@/components/Section";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Link } from "@/components/Link";
import { Avatar } from "@/components/Avatar";
import { Initials } from "@/components/Initials";
import { Icon } from "@/components/Icon";
import {
  IconDomain,
  IconNotification,
} from "@/components/Icon/components/icons";
import { Image } from "@/components/Image";
import { Badge } from "@/components/Badge";
import { CounterBadge } from "@/components/CounterBadge";
import { AlertBadge } from "@/components/AlertBadge";
import { Button } from "@/components/Button";
import { CopyButton } from "@/components/CopyButton";
import { ActionGroup } from "@/components/ActionGroup";
import { Align } from "@/components/Align";
import {
  ContextMenu,
  ContextMenuTrigger,
  MenuItem,
} from "@/components/ContextMenu";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof SkeletonMode> = {
  title: "Content/SkeletonMode/Visual",
  component: SkeletonMode,
  args: {
    isEnabled: true,
  },
  render: (props) => (
    <SkeletonMode {...props}>
      <Section>
        <Heading>
          Webshop Relaunch
          <Badge color="green">Neu</Badge>
          <ContextMenuTrigger>
            <Button variant="plain" color="secondary">
              Aktionen
            </Button>
            <ContextMenu>
              <MenuItem>Umbenennen</MenuItem>
              <MenuItem>Löschen</MenuItem>
            </ContextMenu>
          </ContextMenuTrigger>
        </Heading>
        <Align>
          <Avatar>
            <Initials>Max Mustermann</Initials>
          </Avatar>
          <Text>Max Mustermann ist Projektinhaber.</Text>
        </Align>
        <Align>
          <Icon>
            <IconDomain />
          </Icon>
          <Text>webshop.example-domain.de</Text>
          <CopyButton text="webshop.example-domain.de" />
        </Align>
        <Image
          src={dummyText.imageSrc}
          alt="Vorschau des Webshops"
          height={160}
        />
        <Align>
          <Badge>PHP 8.4</Badge>
          <AlertBadge status="warning">Zertifikat läuft ab</AlertBadge>
          <Button
            variant="soft"
            color="secondary"
            aria-label="Benachrichtigungen"
          >
            <IconNotification />
            <CounterBadge count={3} />
          </Button>
        </Align>
        <ActionGroup>
          <Link href="#">
            <Button color="secondary" variant="soft">
              Zum Projekt
            </Button>
          </Link>
          <Button color="primary">Speichern</Button>
        </ActionGroup>
      </Section>
    </SkeletonMode>
  ),
};

export default meta;

type Story = StoryObj<typeof SkeletonMode>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    isEnabled: false,
  },
};
