import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";
import { page } from "vitest/browser";

test.each(testEnvironments)(
  "Modal default (%s)",
  async ({
    container,
    render,
    components: {
      Button,
      ModalTrigger,
      Modal,
      Content,
      Heading,
      ActionGroup,
      Section,
      Text,
      TextField,
      Label,
      Action,
    },
  }) => {
    await render(
      <ModalTrigger>
        <Button data-testid="trigger">Trigger</Button>
        <Modal>
          <Heading>Heading</Heading>
          <Content>
            <Section>
              <Heading>Heading</Heading>
              <Text>Text</Text>
              <TextField>
                <Label>Label</Label>
              </TextField>
            </Section>
          </Content>
          <ActionGroup>
            <Button>Ok</Button>
            <Action closeOverlay="Modal">
              <Button color="secondary" variant="soft" data-testid="abort">
                Abort
              </Button>
            </Action>
          </ActionGroup>
        </Modal>
      </ModalTrigger>,
    );

    const trigger = page.getByTestId("trigger");
    await trigger.click();

    await expect(container).toMatchScreenshot("Modal - opened");

    const abort = page.getByTestId("abort");
    await abort.click();

    await expect(container).toMatchScreenshot("Modal - closed");
  },
);

test.each(testEnvironments)(
  "Modal offCanvas (%s)",
  async ({
    container,
    render,
    components: {
      Button,
      ModalTrigger,
      Modal,
      Heading,
      ActionGroup,
      Section,
      Text,
      ColumnLayout,
      AccentBox,
    },
  }) => {
    await render(
      <ModalTrigger>
        <Button data-testid="trigger">Trigger</Button>
        <Modal offCanvas size="l">
          <Heading>Heading</Heading>
          <ColumnLayout>
            <Section>
              <Heading>Heading</Heading>
              <Text>Text</Text>
            </Section>
            <AccentBox>AccentBox</AccentBox>
          </ColumnLayout>
          <ActionGroup>
            <Button>Ok</Button>
            <Button color="secondary" variant="soft" data-testid="abort">
              Abort
            </Button>
          </ActionGroup>
        </Modal>
      </ModalTrigger>,
    );

    const trigger = page.getByTestId("trigger");
    await trigger.click();

    await expect(container).toMatchScreenshot("Modal offCanvas - opened");
  },
);
