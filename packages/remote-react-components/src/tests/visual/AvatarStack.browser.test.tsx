import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

const sizes = ["xs", "s", "m", "l"] as const;

test.each(testEnvironments)(
  "AvatarStack sizes (%s)",
  async ({
    testScreenshot,
    render,
    components: { Avatar, Flex, Initials, AvatarStack },
  }) => {
    await render(
      <Flex gap="m" direction="column">
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
      </Flex>,
    );

    await testScreenshot("AvatarStack sizes");
  },
);

test.each(testEnvironments)(
  "AvatarStack with Buttons (%s)",
  async ({
    testScreenshot,
    render,
    components: { Avatar, Initials, AvatarStack, Button },
  }) => {
    await render(
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
      </AvatarStack>,
    );

    await testScreenshot("AvatarStack with Buttons");
  },
);
