import {
  createOverlayController,
  isOverlayController,
  useConfirmOnCloseSource,
} from "@/overlays/overlayController";
import { describe, expect, test, vi } from "vitest";
import {
  computed,
  effectScope,
  isRef,
  nextTick,
  reactive,
  ref,
  watch,
} from "vue";

describe("createOverlayController", () => {
  /* Where an app keeps state: `reactive()`, `ref()`, a Pinia store. */
  test("stays itself inside reactive state", () => {
    const controller = createOverlayController();
    const state = reactive({ editor: controller });
    const held = ref(controller);

    for (const kept of [state.editor, held.value]) {
      expect(kept).toBe(controller);
      expect(isOverlayController(kept)).toBe(true);
      expect(isRef(kept.isOpen)).toBe(true);
    }
  });

  test("starts closed", () => {
    expect(createOverlayController().isOpen.value).toBe(false);
  });

  test("starts open when asked to", () => {
    expect(createOverlayController({ isDefaultOpen: true }).isOpen.value).toBe(
      true,
    );
  });

  test("opens, closes and toggles", () => {
    const controller = createOverlayController();

    controller.open();
    expect(controller.isOpen.value).toBe(true);

    controller.close();
    expect(controller.isOpen.value).toBe(false);

    controller.toggle();
    expect(controller.isOpen.value).toBe(true);
  });

  /*
   * The host reports both directions through one handler — Escape and a click
   * outside arrive as `openChange(false)` — so `setOpen` has to take the value
   * rather than assume a direction.
   */
  test("takes the state the host reports", () => {
    const controller = createOverlayController({ isDefaultOpen: true });

    controller.setOpen(false);
    expect(controller.isOpen.value).toBe(false);

    controller.setOpen(true);
    expect(controller.isOpen.value).toBe(true);
  });
});

/*
 * `confirmOnClose` lives on the controller rather than on the `Modal`, because
 * every way out arrives here: an `Action` inside, the host's dismiss, or an app
 * that holds the controller itself.
 */
describe("confirmOnClose", () => {
  const openConfirming = () => {
    const controller = createOverlayController({ isDefaultOpen: true });
    controller.confirmOnClose.value = true;
    return controller;
  };

  test("asks instead of closing", () => {
    const controller = openConfirming();

    controller.requestClose();

    expect(controller.isConfirmingClose.value).toBe(true);
    expect(controller.isOpen.value).toBe(true);
  });

  test("closes once the confirmation is accepted", () => {
    const controller = openConfirming();

    controller.requestClose();
    controller.confirmClose();

    expect(controller.isOpen.value).toBe(false);
    expect(controller.isConfirmingClose.value).toBe(false);
  });

  test("stays open once the confirmation is declined", () => {
    const controller = openConfirming();

    controller.requestClose();
    controller.cancelClose();

    expect(controller.isOpen.value).toBe(true);
    expect(controller.isConfirmingClose.value).toBe(false);
  });

  /*
   * The host reports a dismiss as `openChange(false)`, which is a close like
   * any other — otherwise Escape is the way around the protection.
   */
  test("asks when the host reports a dismiss", () => {
    const controller = openConfirming();

    controller.setOpen(false);

    expect(controller.isConfirmingClose.value).toBe(true);
    expect(controller.isOpen.value).toBe(true);
  });

  /* As in Flow: `close()` is a close like any other. */
  test("asks when the app closes it", () => {
    const controller = openConfirming();

    controller.close();

    expect(controller.isConfirmingClose.value).toBe(true);
    expect(controller.isOpen.value).toBe(true);
  });

  /*
   * The bypass an `Action` in the modal's footer gets: the deliberate way out
   * does not ask again.
   */
  test("closes without asking when told to bypass the confirmation", () => {
    const controller = openConfirming();

    controller.close({ bypassConfirmation: true });

    expect(controller.isOpen.value).toBe(false);
  });

  test("does not ask while it is already closed", () => {
    const controller = createOverlayController();
    controller.confirmOnClose.value = true;

    controller.requestClose();

    expect(controller.isConfirmingClose.value).toBe(false);
  });
});

/*
 * The refs are views of `OverlayState` from `@mittwald/flow-components-base`:
 * a read subscribes through MobX, a write goes to the state.
 */
describe("refs over the shared state", () => {
  test("a computed follows a change made through a method", () => {
    const controller = createOverlayController();
    const label = computed(() => (controller.isOpen.value ? "open" : "closed"));

    expect(label.value).toBe("closed");
    controller.open();
    expect(label.value).toBe("open");
  });

  /* What a component's render does: an effect that reruns after a change. */
  test("a watcher sees every change", async () => {
    const controller = createOverlayController({ isDefaultOpen: true });
    const seen: unknown[] = [];
    const scope = effectScope();
    scope.run(() =>
      watch(
        () => [
          controller.isOpen.value,
          controller.confirmOnClose.value,
          controller.isConfirmingClose.value,
        ],
        (values) => seen.push(values),
      ),
    );

    controller.confirmOnClose.value = true;
    await nextTick();
    controller.close();
    await nextTick();
    controller.confirmClose();
    await nextTick();
    scope.stop();

    expect(seen).toEqual([
      [true, true, false],
      [true, true, true],
      [false, true, false],
    ]);
  });

  test("writing isOpen sets the state without running a handler", () => {
    const controller = createOverlayController();
    const onOpen = vi.fn();
    controller.addOnOpen(onOpen);

    controller.isOpen.value = true;

    expect(controller.isOpen.value).toBe(true);
    expect(onOpen).not.toHaveBeenCalled();
  });

  test("writing isConfirmingClose false dismisses the confirmation", () => {
    const controller = createOverlayController({ isDefaultOpen: true });
    controller.confirmOnClose.value = true;
    controller.close();

    controller.isConfirmingClose.value = false;

    expect(controller.isConfirmingClose.value).toBe(false);
    expect(controller.isOpen.value).toBe(true);
  });
});

/*
 * A `<Modal confirm-on-close>` and the app each contribute a source, so
 * neither overwrites the other.
 */
describe("confirmation sources", () => {
  const withSource = (
    controller: ReturnType<typeof createOverlayController>,
    confirmOnClose: () => boolean | undefined,
  ) => {
    const scope = effectScope();
    scope.run(() => useConfirmOnCloseSource(() => controller, confirmOnClose));
    return () => scope.stop();
  };

  test("an app's source and a modal's do not overwrite each other", () => {
    const controller = createOverlayController();
    const stop = withSource(controller, () => true);

    controller.confirmOnClose.value = false;
    expect(controller.confirmOnClose.value).toBe(true);

    stop();
    expect(controller.confirmOnClose.value).toBe(false);

    controller.confirmOnClose.value = true;
    withSource(controller, () => false);
    expect(controller.confirmOnClose.value).toBe(true);
  });

  test("a source follows its value and contributes nothing as undefined", async () => {
    const controller = createOverlayController();
    const value = ref<boolean | undefined>(true);
    const stop = withSource(controller, () => value.value);
    expect(controller.confirmOnClose.value).toBe(true);

    value.value = undefined;
    await nextTick();
    expect(controller.confirmOnClose.value).toBe(false);

    stop();
  });

  /* As in Flow: opening again does not answer the confirmation. */
  test("open() leaves a pending confirmation on screen", () => {
    const controller = createOverlayController({ isDefaultOpen: true });
    controller.confirmOnClose.value = true;
    controller.close();

    controller.open();

    expect(controller.isConfirmingClose.value).toBe(true);
  });
});
