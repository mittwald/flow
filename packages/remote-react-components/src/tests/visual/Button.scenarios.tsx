import { firstLetterToUppercase } from "@/tests/lib/firstLetterToUppercase";
import type { VisualScenarios } from "@/tests/lib/visualScenario";
import {
  alphaColors,
  isAlphaColor,
} from "@mittwald/flow-react-components/internal";

const colors = [
  "primary",
  "accent",
  "danger",
  "secondary",
  ...alphaColors,
] as const;
const variants = ["solid", "outline", "soft", "plain"] as const;
const avatarSizes = ["xs", "s", "m", "l"] as const;

export const buttonScenarios: VisualScenarios = {
  "Button states": ({ Flex, Button, IconInfo, Text }) => (
    <Flex direction="column" gap="m">
      <Flex gap="s">
        <Button>Default</Button>
        <Button>
          <IconInfo />
        </Button>
        <Button>
          <IconInfo />
          <Text>Icon & Text</Text>
        </Button>
      </Flex>
      <Flex gap="s">
        <Button size="s">Small</Button>
        <Button size="s">
          <IconInfo />
        </Button>
        <Button size="s">
          <IconInfo />
          <Text>Icon & Text</Text>
        </Button>
      </Flex>

      {variants.map((variant) => (
        <Flex gap="s" key={variant}>
          <Button variant={variant} isPending>
            {firstLetterToUppercase(variant)} Pending
          </Button>
          <Button variant={variant} isSucceeded>
            {firstLetterToUppercase(variant)} Succeeded
          </Button>
          <Button variant={variant} isFailed>
            {firstLetterToUppercase(variant)} Failed
          </Button>
          <Button variant={variant} isDisabled>
            {firstLetterToUppercase(variant)} Disabled
          </Button>
        </Flex>
      ))}
    </Flex>
  ),

  "Button colors": ({ Flex, Button, AccentBox, Wrap }) => (
    <Flex direction="column" gap="m">
      {colors.map((color) => (
        <Wrap if={isAlphaColor(color)} key={color}>
          <AccentBox
            backgroundColor={color.startsWith("light") ? "#3A434E" : "neutral"}
          >
            <Flex gap="s">
              {variants.map((variant) => (
                <Button variant={variant} color={color} key={variant}>
                  {firstLetterToUppercase(color)}{" "}
                  {firstLetterToUppercase(variant)}
                </Button>
              ))}
            </Flex>
          </AccentBox>
        </Wrap>
      ))}
    </Flex>
  ),

  "Button with avatar": ({ Avatar, Button, Initials, Flex }) => (
    <Flex gap="s">
      {avatarSizes.map((size) => (
        <Button key={size}>
          <Avatar size={size}>
            <Initials>Max Mustermann</Initials>
          </Avatar>
        </Button>
      ))}
    </Flex>
  ),

  "Button edge cases": ({ Flex, Button, Text, IconInfo }) => (
    <Flex direction="column" gap="m">
      <Button>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
        quam quas vel voluptas, ullam aliquid fugit. Voluptate harum accusantium
        rerum ullam modi blanditiis vitae, laborum ea tempore, dolore voluptas.
        Earum pariatur, similique corrupti id officia perferendis. Labore,
        similique.
      </Button>
      <Button>
        <IconInfo />
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
          quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
          accusantium rerum ullam modi blanditiis vitae, laborum ea tempore,
          dolore voluptas. Earum pariatur, similique corrupti id officia
          perferendis. Labore, similique.
        </Text>
      </Button>
    </Flex>
  ),
};

export default buttonScenarios;
