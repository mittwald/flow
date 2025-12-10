import { testEnvironments } from "@/tests/lib/environments";
import gopher from "@/tests/assets/gopher.webp";
import { expect, test } from "vitest";

const avatarSizes = ["xs", "s", "m", "l"] as const;

const avatarStates = ["info", "success", "warning", "danger"] as const;

const avatarColors = ["blue", "teal", "green", "violet", "lilac"] as const;

test.each(testEnvironments)(
  "Avatar (%s)",
  async ({
    container,
    render,
    components: { Avatar, Flex, Image, Initials, IconStar },
  }) => {
    await render(
      <Flex gap="m" direction="column">
        {avatarSizes.map((size) => (
          <Flex gap="s">
            <Avatar size={size}>
              <Image alt="Gopher" src={gopher} />
            </Avatar>
            <Avatar size={size}>
              <Initials>Max Mustermann</Initials>
            </Avatar>
            <Avatar size={size}>
              <IconStar />
            </Avatar>
          </Flex>
        ))}
        <Flex gap="s">
          {avatarStates.map((status) => (
            <Avatar status={status} />
          ))}
        </Flex>
        <Flex gap="s">
          {avatarColors.map((color) => (
            <Avatar color={color}>
              <Initials>Max Mustermann</Initials>
            </Avatar>
          ))}
        </Flex>
      </Flex>,
    );

    await expect(container).toMatchScreenshot("Avatar");
  },
);
