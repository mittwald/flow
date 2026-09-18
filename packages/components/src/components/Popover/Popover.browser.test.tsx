import { useRef, useState, type RefObject } from "react";
import { expect, test, vitest } from "vitest";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import Button from "@/components/Button";
import Text from "@/components/Text";
import Popover, { type PopoverProps } from "@/components/Popover/Popover";
import { PopoverTrigger } from "@/components/Popover";
import { useOverlayController } from "@/lib/controller";

const content = page.getByText("These aren't the droids you're looking for.");
const trigger = page.getByRole("button", { name: "Trigger popover" });

const popoverContent = (
  <Text>These aren&apos;t the droids you&apos;re looking for.</Text>
);

const TriggeredPopover = (props: PopoverProps) => (
  <PopoverTrigger>
    <Button>Trigger popover</Button>
    <Popover {...props}>{popoverContent}</Popover>
  </PopoverTrigger>
);

/** A popover without a trigger – the only place its own open defaults apply. */
const StandalonePopover = (props: PopoverProps) => {
  const triggerRef = useRef(null) as RefObject<HTMLButtonElement | null>;

  return (
    <>
      <Button ref={triggerRef}>Trigger popover</Button>
      <Popover triggerRef={triggerRef} {...props}>
        {popoverContent}
      </Popover>
    </>
  );
};

test("onOpenChange reports the close without suppressing it", async () => {
  const onOpenChange = vitest.fn();
  render(<TriggeredPopover onOpenChange={onOpenChange} />);

  await userEvent.click(trigger);
  await expect.element(content).toBeInTheDocument();
  expect(onOpenChange).toHaveBeenLastCalledWith(true);

  await userEvent.keyboard("{Escape}");
  await expect.element(content).not.toBeInTheDocument();
  expect(onOpenChange).toHaveBeenLastCalledWith(false);
});

test("onOpenChange does not gain a controller handler's abort semantics", async () => {
  render(<TriggeredPopover onOpenChange={() => false} />);

  await userEvent.click(trigger);
  await expect.element(content).toBeInTheDocument();

  await userEvent.keyboard("{Escape}");
  await expect.element(content).not.toBeInTheDocument();
});

test("onOpenChange also reports a close performed through the controller", async () => {
  const onOpenChange = vitest.fn();

  const WithController = () => {
    const controller = useOverlayController("Popover", {
      reuseControllerFromContext: false,
    });
    const triggerRef = useRef(null) as RefObject<HTMLButtonElement | null>;

    return (
      <>
        <Button ref={triggerRef} onPress={controller.open}>
          Trigger popover
        </Button>
        <Popover
          triggerRef={triggerRef}
          controller={controller}
          onOpenChange={onOpenChange}
        >
          <Button onPress={() => controller.close()}>Close from inside</Button>
        </Popover>
      </>
    );
  };

  render(<WithController />);

  await userEvent.click(trigger);
  const dismiss = page.getByRole("button", { name: "Close from inside" });
  await expect.element(dismiss).toBeInTheDocument();
  expect(onOpenChange).toHaveBeenLastCalledWith(true);

  await userEvent.click(dismiss);
  await expect.element(dismiss).not.toBeInTheDocument();
  expect(onOpenChange).toHaveBeenLastCalledWith(false);
});

test("isOpen controls the popover", async () => {
  const Controlled = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <Button onPress={() => setIsOpen(true)}>Open from outside</Button>
        <TriggeredPopover isOpen={isOpen} onOpenChange={setIsOpen} />
      </>
    );
  };

  render(<Controlled />);

  await userEvent.click(
    page.getByRole("button", { name: "Open from outside" }),
  );
  await expect.element(content).toBeInTheDocument();

  await userEvent.keyboard("{Escape}");
  await expect.element(content).not.toBeInTheDocument();
});

test("a controlled popover stays closed while its state is not updated", async () => {
  render(<TriggeredPopover isOpen={false} onOpenChange={() => undefined} />);

  await userEvent.click(trigger);

  await expect.element(content).not.toBeInTheDocument();
});

test("isDefaultOpen opens the popover initially", async () => {
  render(<StandalonePopover isDefaultOpen />);

  await expect.element(content).toBeInTheDocument();
});

test("the deprecated defaultOpen keeps working", async () => {
  render(<StandalonePopover defaultOpen />);

  await expect.element(content).toBeInTheDocument();
});
