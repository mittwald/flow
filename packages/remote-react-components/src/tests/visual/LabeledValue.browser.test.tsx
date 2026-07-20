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
          A long time ago in a galaxy far, far away, the Rebel Alliance struck a
          decisive blow against the Galactic Empire. Rebel spies managed to
          steal secret plans to the Empire's ultimate weapon, the Death Star.
        </Label>
        <Content>
          A long time ago in a galaxy far, far away, the Rebel Alliance struck a
          decisive blow against the Galactic Empire. Rebel spies managed to
          steal secret plans to the Empire's ultimate weapon, the Death Star.
        </Content>
        <CopyButton text="Content" />
      </LabeledValue>,
    );

    await testScreenshot("LabeledValue edge cases");
  },
);
