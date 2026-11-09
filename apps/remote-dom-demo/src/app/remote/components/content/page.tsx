"use client";
import { ComponentGroupPage } from "@/app/remote/components/_lib/ComponentGroupPage";
import {
  Avatar,
  AvatarStack,
  Button,
  CodeBlock,
  Color,
  Content,
  Flex,
  Heading,
  Icon,
  IconApp,
  IllustratedMessage,
  Image,
  Initials,
  InlineCode,
  Kbd,
  Label,
  LabeledValue,
  Markdown,
  Section,
  Skeleton,
  SkeletonMode,
  SkeletonText,
  Text,
  Truncate,
} from "@mittwald/flow-remote-react-components";
import { IconCircleCheck } from "@tabler/icons-react";

const logo = "https://flow.mittwald.de/assets/mittwald_logo_rgb.jpg";

const hyperdriveConfig = `hyperdrive:
  class: 0.5
  backup: true`;

const svgElement = (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" />
  </svg>
);

export default function Page() {
  return (
    <ComponentGroupPage title="Content">
      <Section>
        <Heading level={3}>Avatar</Heading>
        <Avatar>
          <Initials>Luke Skywalker</Initials>
        </Avatar>
      </Section>

      <Section>
        <Heading level={3}>AvatarStack</Heading>
        <AvatarStack>
          <Avatar>
            <Initials>Luke Skywalker</Initials>
          </Avatar>
          <Avatar>
            <Initials>Leia Organa</Initials>
          </Avatar>
          <Avatar>
            <Initials>Han Solo</Initials>
          </Avatar>
        </AvatarStack>
      </Section>

      <Section>
        <Heading level={3}>CodeBlock</Heading>
        <CodeBlock language="yaml" code={hyperdriveConfig} />
      </Section>

      <Section>
        <Heading level={3}>Color</Heading>
        <Text>
          Join the <Color color="violet">Rebel Alliance</Color> today.
        </Text>
      </Section>

      <Section>
        <Heading level={3}>Heading</Heading>
        <Heading level={4}>Hangar bay</Heading>
      </Section>

      <Section>
        <Heading level={3}>Icon</Heading>
        {/* A Flow icon, a Tabler icon and a raw SVG: the last two cross the
            boundary as slotted React subtrees. */}
        <Flex gap="m">
          <IconApp />
          <Icon>
            <IconCircleCheck />
          </Icon>
          <Icon>{svgElement}</Icon>
        </Flex>
      </Section>

      <Section>
        <Heading level={3}>IllustratedMessage</Heading>
        <IllustratedMessage>
          <IconApp />
          <Heading>No ships in the hangar</Heading>
          <Text>Add your first ship to plan a mission.</Text>
          <Button>Add ship</Button>
        </IllustratedMessage>
      </Section>

      <Section>
        <Heading level={3}>Image</Heading>
        <Image src={logo} alt="mittwald" width={150} />
      </Section>

      <Section>
        <Heading level={3}>InlineCode</Heading>
        <Text>
          Type <InlineCode>hyperdrive --engage</InlineCode> to jump to
          lightspeed.
        </Text>
      </Section>

      <Section>
        <Heading level={3}>Kbd</Heading>
        <Kbd keys={["mod", "k"]} />
      </Section>

      <Section>
        <Heading level={3}>Label</Heading>
        <Label>Call sign</Label>
      </Section>

      <Section>
        <Heading level={3}>LabeledValue</Heading>
        <LabeledValue>
          <Label>Cargo capacity</Label>
          <Content>100 metric tons</Content>
        </LabeledValue>
      </Section>

      <Section>
        <Heading level={3}>Markdown</Heading>
        <Markdown>
          The **Death Star** is fully operational and moving toward the *Endor*
          system, guarded by the ***entire Imperial fleet***.
        </Markdown>
      </Section>

      <Section>
        <Heading level={3}>Skeleton</Heading>
        <Skeleton />
      </Section>

      <Section>
        <Heading level={3}>SkeletonMode</Heading>
        <Text>Turn on skeleton mode above: this paragraph turns grey.</Text>
        <SkeletonMode isEnabled={false}>
          <Text>This one stays, its own SkeletonMode is disabled.</Text>
        </SkeletonMode>
      </Section>

      <Section>
        <Heading level={3}>SkeletonText</Heading>
        <Text>
          <SkeletonText />
        </Text>
      </Section>

      <Section>
        <Heading level={3}>Text</Heading>
        <Text>A long time ago in a galaxy far, far away.</Text>
      </Section>

      <Section>
        <Heading level={3}>Truncate</Heading>
        <Text>
          <Truncate title="It is a period of civil war. Rebel spaceships, striking from a hidden base, have won their first victory against the evil Galactic Empire.">
            It is a period of civil war. Rebel spaceships, striking from a
            hidden base, have won their first victory against the evil Galactic
            Empire.
          </Truncate>
        </Text>
      </Section>
    </ComponentGroupPage>
  );
}
