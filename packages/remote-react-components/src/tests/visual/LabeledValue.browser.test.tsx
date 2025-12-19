import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

test.each(testEnvironments)(
  "LabeledValue combinations (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      Label,
      ColumnLayout,
      LabeledValue,
      Content,
      CopyButton,
      InlineCode,
      Link,
      Button,
      ContextualHelpTrigger,
      ContextualHelp,
      Text,
    },
  }) => {
    await render(
      <ColumnLayout>
        <LabeledValue>
          <Label>Label</Label>
          <Content>Content</Content>
          <CopyButton text="Content" />
        </LabeledValue>
        <LabeledValue>
          <Label>Label</Label>
          <InlineCode>InlineCode</InlineCode>
          <CopyButton text="InlineCode" />
        </LabeledValue>
        <LabeledValue>
          <Label>Label</Label>
          <Link>Link</Link>
          <CopyButton text="Link" />
        </LabeledValue>
        <LabeledValue>
          <Label>Label</Label>
          <Button>Button</Button>
        </LabeledValue>
        <LabeledValue>
          <Label>
            Label
            <ContextualHelpTrigger>
              <Button />
              <ContextualHelp />
            </ContextualHelpTrigger>
          </Label>
          <Text>Text</Text>
        </LabeledValue>
      </ColumnLayout>,
    );

    await testScreenshot("LabeledValue combinations");
  },
);

test.each(testEnvironments)(
  "LabeledValue edge cases (%s)",
  async ({
    testScreenshot,
    render,
    components: { Label, LabeledValue, Content, CopyButton },
  }) => {
    await render(
      <LabeledValue>
        <Label>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
          quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
          accusantium rerum ullam modi blanditiis vitae, laborum ea tempore,
          dolore voluptas.
        </Label>
        <Content>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
          quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
          accusantium rerum ullam modi blanditiis vitae, laborum ea tempore,
          dolore voluptas.
        </Content>
        <CopyButton text="Content" />
      </LabeledValue>,
    );

    await testScreenshot("LabeledValue edge cases");
  },
);
