import { testEnvironments } from "@/tests/lib/environments";
import gopher from "@/tests/assets/gopher.webp";
import { test } from "vitest";

const sizes = ["xs", "s", "m", "l"] as const;
const states = ["info", "success", "warning", "danger"] as const;
const colors = ["blue", "teal", "green", "violet", "lilac"] as const;

test.each(testEnvironments)(
  "Avatar (%s)",
  async ({
    testScreenshot,
    render,
    components: { Avatar, Flex, Image, Initials, IconStar },
  }) => {
    await render(
      <Flex gap="m" direction="column">
        {sizes.map((size) => (
          <Flex gap="s" key={size}>
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
          {states.map((status) => (
            <Avatar key={status} status={status} />
          ))}
        </Flex>
        <Flex gap="s">
          {colors.map((color) => (
            <Avatar color={color} key={color}>
              <Initials>Max Mustermann</Initials>
            </Avatar>
          ))}
        </Flex>
      </Flex>,
    );

    await testScreenshot("Avatar", {
      comparatorOptions: {
        // Gopher image has some compression artifacts
        threshold: 0.2,
      },
    });
  },
);
