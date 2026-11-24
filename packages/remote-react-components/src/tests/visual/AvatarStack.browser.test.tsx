import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

const sizes = ["xs", "s", "m", "l"] as const;

test.each(testEnvironments)(
  "AvatarStack (%s)",
  async ({
    testScreenshot,
    render,
    components: { Flex, Avatar, Initials, AvatarStack, Button, Label },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        {sizes.map((size) => (
          <AvatarStack size={size} totalCount={10} key={size}>
            <Avatar>
              <Initials>A</Initials>
            </Avatar>
            <Avatar>
              <Initials>B</Initials>
            </Avatar>
            <Avatar>
              <Initials>C</Initials>
            </Avatar>
          </AvatarStack>
        ))}
        <Label>With Buttons</Label>
        <AvatarStack>
          <Button>
            <Avatar>
              <Initials>A</Initials>
            </Avatar>
          </Button>
          <Button>
            <Avatar>
              <Initials>B</Initials>
            </Avatar>
          </Button>
          <Button>
            <Avatar>
              <Initials>C</Initials>
            </Avatar>
          </Button>
        </AvatarStack>
      </Flex>,
    );

    await testScreenshot("AvatarStack");
  },
);
