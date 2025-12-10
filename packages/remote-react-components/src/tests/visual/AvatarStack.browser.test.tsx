import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";
import React from "react";
import { userEvent } from "vitest/browser";

const avatarSizes = ["xs", "s", "m", "l"] as const;

test.each(testEnvironments)(
  "AvatarStack (%s)",
  async ({
    container,
    render,
    components: { Avatar, Flex, Initials, AvatarStack, Button },
  }) => {
    await render(
      <Flex gap="m" direction="column">
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

        {avatarSizes.map((size) => (
          <>
            <AvatarStack size={size} totalCount={10}>
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
          </>
        ))}
      </Flex>,
    );

    await userEvent.tab();
    await userEvent.tab();

    await expect(container).toMatchScreenshot("AvatarStack");
  },
);
