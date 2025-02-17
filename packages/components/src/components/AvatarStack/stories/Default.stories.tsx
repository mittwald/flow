import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Image } from "@/components/Image";
import { dummyText } from "@/lib/dev/dummyText";
import { AvatarStack } from "@/components/AvatarStack";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { action } from "@storybook/addon-actions";

const meta: Meta<typeof AvatarStack> = {
  title: "Content/AvatarStack",
  component: AvatarStack,
  render: (props) => (
    <AvatarStack {...props} totalCount={20}>
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

export const WithClickableAvatars: Story = {
  render: (props) => (
    <AvatarStack
      {...props}
      totalCount={20}
      onCountPress={action("count clicked")}
    >
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
