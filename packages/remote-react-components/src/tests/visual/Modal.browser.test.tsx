import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { page } from "vitest/browser";

test.each(testEnvironments)(
  "Modal default (%s)",
  async ({
    testScreenshot,
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

    await testScreenshot("Modal - opened");

    const abort = page.getByTestId("abort");
    await abort.click();

    await testScreenshot("Modal - closed");
  },
);

test.each(testEnvironments)(
  "Modal offCanvas (%s)",
  async ({
    testScreenshot,
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

    await testScreenshot("Modal offCanvas - opened");
  },
);

test.each(testEnvironments)(
  "Modal in ContextMenu (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      MenuItem,
      Button,
      ContextMenu,
      ContextMenuTrigger,
      useOverlayController,
      Modal,
      Heading,
      Content,
    },
  }) => {
    function Wrapper() {
      const controller = useOverlayController("Modal");

      return (
        <>
          <ContextMenuTrigger>
            <Button data-testid="contextMenuTrigger">
              ContextMenu trigger
            </Button>
            <ContextMenu>
              <MenuItem data-testid="modalTrigger" onPress={controller.open}>
                Modal trigger
              </MenuItem>
            </ContextMenu>
          </ContextMenuTrigger>
          <Modal controller={controller}>
            <Heading>Modal</Heading>
            <Content>Content</Content>
          </Modal>
        </>
      );
    }

    await render(<Wrapper />);

    const contextMenuTrigger = page.getByTestId("contextMenuTrigger");
    const modalTrigger = page.getByTestId("modalTrigger");

    await contextMenuTrigger.click();

    await testScreenshot("Modal in ContextMenu - ContextMenu opened");

    await modalTrigger.click();

    await testScreenshot("Modal in ContextMenu - Modal opened");
  },
);

test.each(testEnvironments)(
  "Modal in Section Header (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      Button,
      Modal,
      Heading,
      Content,
      ModalTrigger,
      Section,
      Header,
    },
  }) => {
    await render(
      <Section>
        <Header>
          <Heading>Heading</Heading>
          <ModalTrigger>
            <Button data-testid="trigger">Trigger</Button>
            <Modal>
              <Heading>Modal</Heading>
              <Content>Content</Content>
            </Modal>
          </ModalTrigger>
        </Header>
      </Section>,
    );

    const trigger = page.getByTestId("trigger");

    await trigger.click();

    await testScreenshot("Modal in Section Header - ContextMenu opened");
  },
);
