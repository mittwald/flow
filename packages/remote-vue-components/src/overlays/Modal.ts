import {
  ActionGroup,
  Button,
  Content,
  Heading,
  OverlayContent,
  Text,
} from "@/auto-generated";
import Action from "@/components/Action";
import { useLanguage } from "@/composables/remoteContext";
import { mapChildren, mapSlottedChildren } from "@/overlays/childProps";
import {
  createOverlayController,
  createOverlayControllerFor,
  injectOverlayController,
  provideOverlayController,
  type OverlayController,
} from "@/overlays/overlayController";
import { markAsOverlay } from "@/overlays/overlayRegistry";
import type { AnyRecord } from "@/lib/types";
import {
  defineComponent,
  h,
  onBeforeUnmount,
  watchEffect,
  type Component,
  type PropType,
  type VNode,
} from "vue";

export type ModalSize = "s" | "m" | "l";

/*
 * Flow's `Modal` is a React composition, not a remote element: it renders an
 * `OverlayContent` and configures the components inside it through a props
 * context — the header, the content padding, the footer spacing. Both halves
 * are rebuilt here, so a Vue app writes `Modal` and not the overlay plumbing.
 *
 * The class names are Flow's own, taken from `Modal.module.scss` by way of the
 * generated `flow--…` names. They are internal, and repeating them is the price
 * of a composition that lives in React: the alternative — marking `Modal`
 * `@flr-generate`, so the host materialises the whole thing from one element —
 * would make this file unnecessary.
 */
const styles = {
  overlay: "flow--overlay",
  modal: "flow--modal",
  offCanvas: "flow--modal--off-canvas",
  left: "flow--modal--left",
  size: (size: ModalSize) => `flow--modal--size-${size}`,
  header: "flow--modal--header",
  content: "flow--modal--content",
  actionGroup: "flow--modal--action-group",
};

/*
 * Copied from `packages/components/src/components/Modal/locales/*.locale.json`.
 *
 * Flow's are compiled into the React bundle by a locale plugin and are not
 * importable from a published package, so the only way a Vue binding can put
 * words on this modal is to carry its own. Four strings, and a rewording on the
 * Flow side is a translation drift rather than a broken modal — but it is a
 * second copy, and the generated `Modal` this layer argues for would remove it.
 */
const confirmCloseTexts = {
  "en-US": {
    heading: "Unsaved changes",
    text: "You have unsaved changes. Are you sure you want to close the modal? All changes will be lost.",
    close: "Close",
    keepOpen: "Keep editing",
  },
  "de-DE": {
    heading: "Ungespeicherte Änderungen",
    text: "Du hast ungespeicherte Änderungen. Möchtest du das Modal wirklich schließen? Alle Änderungen gehen dabei verloren.",
    close: "Schließen",
    keepOpen: "Weiter bearbeiten",
  },
};

/*
 * Both spellings, because a vnode carries the prop as the template wrote it and
 * Vue only camelizes when it resolves the props of the component itself.
 */
const closePropNames = [
  "closeModal",
  "close-modal",
  "closeOverlay",
  "close-overlay",
];

/**
 * Lets an `Action` in the modal's footer close without asking again.
 *
 * Only where the action already closes something: Flow's props context rewrites
 * an existing `closeModal`/`closeOverlay` and adds none, and an `Action` that
 * merely runs something must not be turned into a close button.
 */
const withBypassedConfirmation = (child: VNode): AnyRecord | undefined => {
  if (child.type !== Action) {
    return undefined;
  }

  const props: AnyRecord = child.props ?? {};
  const bypassed: AnyRecord = {};

  for (const name of closePropNames) {
    const value = props[name];

    if (value === undefined || value === null || value === false) {
      continue;
    }

    bypassed[name] =
      typeof value === "object"
        ? { ...value, bypassConfirmation: true }
        : { bypassConfirmation: true };
  }

  return Object.keys(bypassed).length > 0 ? bypassed : undefined;
};

/**
 * Asks before a `<Modal confirm-on-close>` closes.
 *
 * Bound to the parent's `isConfirmingClose` rather than holding state of its
 * own: a dismiss of this modal is then the same event as answering "keep
 * editing", and there is one place that decides whether the parent closes.
 *
 * Annotated rather than inferred — it renders a `Modal` and the `Modal` renders
 * it, and without an annotation TypeScript cannot break that cycle (TS7022).
 */
const ConfirmCloseModal: Component = defineComponent({
  name: "ConfirmCloseModal",

  props: {
    parent: {
      type: Object as PropType<OverlayController>,
      required: true,
    },
  },

  setup(props) {
    const language = useLanguage();
    const controller = createOverlayControllerFor(
      props.parent.isConfirmingClose,
    );

    return () => {
      const texts = language.value?.startsWith("de")
        ? confirmCloseTexts["de-DE"]
        : confirmCloseTexts["en-US"];

      return h(Modal, { controller }, () => [
        h(Heading, null, () => texts.heading),
        h(Content, null, () => h(Text, null, () => texts.text)),
        h(ActionGroup, null, () => [
          h(Action, { onAction: props.parent.confirmClose }, () =>
            h(Button, { color: "danger" }, () => texts.close),
          ),
          h(Action, { onAction: props.parent.cancelClose }, () =>
            h(
              Button,
              { color: "secondary", variant: "soft" },
              () => texts.keepOpen,
            ),
          ),
        ]),
      ]);
    };
  },
});

export const Modal = markAsOverlay(
  defineComponent({
    name: "Modal",

    props: {
      /** The size of the modal. @default "s" */
      size: { type: String as PropType<ModalSize>, default: "s" },
      /** Whether the modal is displayed as an off canvas. */
      offCanvas: { type: Boolean, default: false },
      /** Which side the off canvas comes from. @default "right" */
      offCanvasOrientation: {
        type: String as PropType<"left" | "right">,
        default: "right",
      },
      /** Whether a click outside closes the modal. @default true */
      isDismissable: { type: Boolean, default: true },
      /**
       * Whether closing the modal has to be confirmed — use it to protect
       * unsaved changes.
       */
      confirmOnClose: { type: Boolean, default: false },
      /** A controller to open and close the modal from anywhere. */
      controller: {
        type: Object as PropType<OverlayController>,
        default: undefined,
      },
    },

    setup(props, { slots, attrs }) {
      /*
       * Three ways to own the state, in Flow's order of precedence: a
       * controller the app passes, the controller of a surrounding trigger, or
       * one of its own.
       */
      const controller =
        props.controller ??
        injectOverlayController() ??
        createOverlayController();

      // So an `Action closeModal` inside finds it.
      provideOverlayController(controller);

      /*
       * The requirement lives on the controller, not on this component: what
       * asks for the confirmation is a close, and a close arrives at the
       * controller — from an `Action` inside, from the host's dismiss, or from
       * an app holding the controller itself.
       */
      watchEffect(() => {
        controller.confirmOnClose.value = props.confirmOnClose;
      });

      /*
       * Taken back, because the controller usually outlives the modal: a
       * trigger keeps it, and the next modal it opens would inherit a
       * requirement it never asked for.
       */
      onBeforeUnmount(() => {
        controller.confirmOnClose.value = false;
        controller.isConfirmingClose.value = false;
      });

      return () => {
        const className = [
          styles.overlay,
          props.offCanvas ? styles.offCanvas : styles.modal,
          styles.size(props.size),
          props.offCanvas && props.offCanvasOrientation === "left"
            ? styles.left
            : undefined,
          attrs.class,
        ]
          .filter(Boolean)
          .join(" ");

        const children: VNode[] = mapChildren(slots.default?.(), (child) => {
          if (child.type === Heading) {
            return { class: styles.header, level: 2 };
          }
          if (child.type === Content) {
            return { class: styles.content };
          }
          if (child.type === ActionGroup) {
            return { class: styles.actionGroup, spacing: "m" };
          }
          return undefined;
        }).map((child) =>
          /*
           * The footer is the deliberate way out, so its actions close without
           * asking again — the rule Flow's `Modal` writes into the props
           * context for `ActionGroup > Action`. An `Action` anywhere else in
           * the modal is an incidental close and is confirmed.
           */
          props.confirmOnClose && child.type === ActionGroup
            ? mapSlottedChildren(child, withBypassedConfirmation)
            : child,
        );

        if (props.confirmOnClose) {
          children.push(h(ConfirmCloseModal, { parent: controller }));
        }

        return h(
          OverlayContent,
          {
            class: className,
            isOpen: controller.isOpen.value,
            isDismissable: props.isDismissable,
            onOpenChange: controller.setOpen,
          },
          () => children,
        );
      };
    },
  }),
);

export default Modal;
