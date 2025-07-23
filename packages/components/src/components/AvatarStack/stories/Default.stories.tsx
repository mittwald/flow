import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Image } from "@/components/Image";
import { dummyText } from "@/lib/dev/dummyText";
import { AvatarStack } from "@/components/AvatarStack";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { action } from "storybook/actions";

const meta: Meta<typeof AvatarStack> = {
  title: "Content/AvatarStack",
  component: AvatarStack,
  args: { totalCount: 20 },
  render: (props) => (
    <AvatarStack {...props}>
      <Avatar size={props.size}>
        <Image alt="Gopher" src={dummyText.imageSrc} />
      </Avatar>
      <Avatar size={props.size}>
        <Image alt="Gopher" src={dummyText.imageSrc} />
      </Avatar>
      <Avatar size={props.size}>
        <Image alt="Gopher" src={dummyText.imageSrc} />
      </Avatar>
    </AvatarStack>
  ),
};
export default meta;

type Story = StoryObj<typeof AvatarStack>;

export const Default: Story = {};

export const ClickableAvatars: Story = {
  render: (props) => (
    <AvatarStack {...props} onCountPress={action("count clicked")}>
      <Button onPress={action("avatar clicked")}>
        <Avatar size={props.size}>
          <Image alt="Gopher" src={dummyText.imageSrc} />
        </Avatar>
      </Button>{" "}
      <Button onPress={action("avatar clicked")}>
        <Avatar size={props.size}>
          <Image alt="Gopher" src={dummyText.imageSrc} />
        </Avatar>
      </Button>{" "}
      <Button onPress={action("avatar clicked")}>
        <Avatar size={props.size}>
          <Image alt="Gopher" src={dummyText.imageSrc} />
        </Avatar>
      </Button>
    </AvatarStack>
  ),
};

export const WithoutTotalCount: Story = {
  args: { totalCount: undefined },
  render: (props) => (
    <AvatarStack {...props}>
      <Avatar size={props.size}>
        <Image alt="Gopher" src={dummyText.imageSrc} />
      </Avatar>
      <Avatar size={props.size}>
        <Image alt="Gopher" src={dummyText.imageSrc} />
      </Avatar>
      <Avatar size={props.size}>
        <Image alt="Gopher" src={dummyText.imageSrc} />
      </Avatar>
    </AvatarStack>
  ),
};
