import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import gopher from "@/tests/assets/gopher.webp";
import {
  alphaColors,
  isAlphaColor,
} from "@mittwald/flow-react-components/internal";

const colors = ["primary", ...alphaColors] as const;

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
          <Wrap if={isAlphaColor(color)} key={color}>
            <AccentBox
              backgroundColor={
                color.startsWith("light") ? "#3A434E" : "neutral"
              }
            >
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
