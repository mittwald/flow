import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import gopher from "@/tests/assets/gopher.webp";

const colors = ["primary", "dark", "light"] as const;

test.each(testEnvironments)(
  "HeaderNavigation (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      HeaderNavigation,
      Flex,
      Link,
      Button,
      IconSearch,
      Wrap,
      AccentBox,
      Avatar,
      Image,
    },
  }) => {
    await render(
      <Flex gap="m" direction="column">
        {colors.map((color) => (
          <Wrap if={color === "light"} key={color}>
            <AccentBox>
              <HeaderNavigation color={color}>
                <Link>Link</Link>
                <Link aria-current="page">Current</Link>
                <Button>
                  <IconSearch />
                </Button>
                <Button>
                  <Avatar>
                    <Image alt="Gopher" src={gopher} />
                  </Avatar>
                </Button>
              </HeaderNavigation>
            </AccentBox>
          </Wrap>
        ))}
      </Flex>,
    );

    await testScreenshot("HeaderNavigation");
  },
);
