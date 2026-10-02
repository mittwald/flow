import {
  AccentBox,
  ActionGroup,
  Button,
  ClearPropsContext,
  ColumnLayout,
  Content,
  Div,
  Header,
  Heading,
  OverlayContent,
  Section,
  Text,
} from "@/auto-generated";
import { IconClose } from "@/icons";
import Action from "@/components/Action";
import { useLanguage } from "@/composables/remoteContext";
import {
  applyChildRules,
  dynamic,
  withSlotContent,
  type ChildRules,
} from "@/overlays/childProps";
import { readProp } from "@/lib/propKeys";
import {
  createOverlayControllerFor,
  isOverlayController,
  provideOverlayContext,
  useOwnController,
  useOverlayHandlers,
  type OverlayCloseHandler,
  type OverlayController,
  type OverlayOpenHandler,
  type OverlayOpenStateHandler,
} from "@/overlays/overlayController";
import { markAsOverlay } from "@/overlays/overlayRegistry";
import type { AnyRecord } from "@/lib/types";
import {
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  useId,
  watch,
  watchEffect,
  type Component,
  type PropType,
  type VNode,
} from "vue";
import { composition } from "@/lib/composition";
import { useComponentUsage } from "@/composables/useComponentUsage";

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
  headerTitle: "flow--modal--header-title",
  closeButton: "flow--modal--close-button",
  alwaysVisible: "flow--modal--always-visible",
  alwaysHidden: "flow--modal--always-hidden",
  content: "flow--modal--content",
  columnLayout: "flow--modal--column-layout",
  accentBox: "flow--modal--accent-box",
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

/**
 * The chrome Flow puts around a modal's heading: the title in its own
 * container, and the close button beside it.
 *
 * Not props on the heading but a rebuild of what it was handed — the reason
 * `withSlotContent` exists. The close button clears the props context around
 * it, the way Flow's does, so the modal's own rules for `Button` do not reach
 * it, and it closes without asking again: this button _is_ the deliberate way
 * out.
 */
const withHeaderChrome = (
  heading: VNode,
  closeLabel: string,
  showCloseButton: boolean | undefined,
): VNode =>
  withSlotContent(heading, (title) => [
    h(Div, { class: styles.headerTitle }, () => title),
    h(ClearPropsContext, null, () =>
      h(Action, { closeModal: { bypassConfirmation: true } }, () =>
        h(
          Button,
          {
            variant: "plain",
            color: "secondary",
            "aria-label": closeLabel,
            class: [
              styles.closeButton,
              showCloseButton === true
                ? styles.alwaysVisible
                : showCloseButton === false
                  ? styles.alwaysHidden
                  : undefined,
            ]
              .filter(Boolean)
              .join(" "),
          },
          () => h(IconClose),
        ),
      ),
    ),
  ]);

/**
 * Lets an `Action` in the modal's footer close without asking again.
 *
 * Only where the action already closes something: Flow's props context rewrites
 * an existing `closeModal`/`closeOverlay` and adds none, and an `Action` that
 * merely runs something must not be turned into a close button. An explicit
 * `bypassConfirmation` in the object form wins, as in Flow.
 */
const withBypassedConfirmation = (child: VNode): AnyRecord | undefined => {
  if (child.type !== Action) {
    return undefined;
  }

  const bypassed: AnyRecord = {};

  for (const name of ["closeModal", "closeOverlay"]) {
    const value = readProp(child.props, name);

    if (value === undefined || value === null || value === false) {
      continue;
    }

    /*
     * A controller names the overlay, like a type name does — spread, it
     * would lose its identity and the action would close the modal instead.
     */
    bypassed[name] = dynamic(
      isOverlayController(value) || (typeof value === "string" && value !== "")
        ? { bypassConfirmation: true, overlay: value }
        : typeof value === "object"
          ? { bypassConfirmation: true, ...value }
          : { bypassConfirmation: true },
    );
  }

  return Object.keys(bypassed).length > 0 ? bypassed : undefined;
};

/*
 * Flow's `nestedHeadingProps`: inside the content, headings are one level
 * down, and a section drops its separator.
 */
const headingLevel3: ChildRules = (child) =>
  child.type === Heading ? { props: { level: 3 } } : undefined;

const nestedHeadingRules: ChildRules = (child) =>
  child.type === Heading
    ? { props: { level: 3 } }
    : child.type === Section
      ? {
          props: { hideSeparator: true },
          children: (grandChild) =>
            grandChild.type === Header
              ? { children: headingLevel3 }
              : headingLevel3(grandChild),
        }
      : child.type === Header
        ? { children: headingLevel3 }
        : undefined;

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

    /* Like Flow's, a modal passes on only the props it knows. */
    inheritAttrs: false,

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
       * Whether the close button is always visible (`true`) or always hidden
       * (`false`). By default Flow decides by screen size.
       */
      showCloseButton: { type: Boolean, default: undefined },
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
      /** Whether the modal is open. Use it to control the modal state. */
      isOpen: { type: Boolean, default: undefined },
      /**
       * Whether the modal is open initially, when it has a controller of its
       * own — not one from a trigger or the `controller` prop. @default false
       */
      isDefaultOpen: { type: Boolean, default: undefined },
      /** Called when the modal opens. Returning `false` keeps it closed. */
      onOpen: {
        type: Function as PropType<OverlayOpenHandler>,
        default: undefined,
      },
      /** Called when the modal closes. Returning `false` keeps it open. */
      onClose: {
        type: Function as PropType<OverlayCloseHandler>,
        default: undefined,
      },
      /**
       * Called with the new state whenever the modal opens or closes. Returning
       * `false` aborts the change.
       */
      onOpenChange: {
        type: Function as PropType<OverlayOpenStateHandler>,
        default: undefined,
      },
    },

    setup(props, { slots, attrs }) {
      /* Flow's React `Modal` is a `flowComponent` and reports itself. */
      onMounted(useComponentUsage("Modal"));

      const language = useLanguage();
      /*
       * The dialog is labelled by its own heading, so the two need an id they
       * agree on. Flow generates one with `useId`; `useId` exists in Vue too,
       * and both sides end up with an id the host rewrites anyway — what has to
       * match is that the heading carries one at all.
       */
      const headingId = useId();
      /*
       * Three ways to own the state, in Flow's order of precedence: a
       * controller the app passes, the controller of a surrounding trigger, or
       * one of its own.
       */
      const controller = useOwnController(
        () => props.controller,
        "Modal",
        () => ({ isDefaultOpen: props.isDefaultOpen }),
      );

      // So an `Action` inside finds it.
      provideOverlayContext("Modal", () => controller.value);

      useOverlayHandlers(() => controller.value, {
        onOpen: () => props.onOpen,
        onClose: () => props.onClose,
        onOpenChange: () => props.onOpenChange,
      });

      /*
       * The requirement lives on the controller, not on this component: what
       * asks for the confirmation is a close, and a close arrives at the
       * controller — from an `Action` inside, from the host's dismiss, or from
       * an app holding the controller itself.
       */
      watchEffect(() => {
        controller.value.confirmOnClose.value = props.confirmOnClose;
      });

      /*
       * Taken back, because the controller usually outlives the modal: a
       * trigger keeps it, and the next modal it opens would inherit a
       * requirement it never asked for. The same goes for a controller the
       * app swapped for another.
       */
      const release = (released: OverlayController) => {
        released.confirmOnClose.value = false;
        released.isConfirmingClose.value = false;
      };
      watch(controller, (next, previous) => release(previous));
      onBeforeUnmount(() => release(controller.value));

      /* Flow's props context for the modal's children, rule for rule. */
      const childRules: ChildRules = (child) => {
        if (child.type === Heading) {
          return { props: { class: styles.header, level: 2, id: headingId } };
        }
        if (child.type === Content) {
          return {
            props: { class: styles.content },
            children: nestedHeadingRules,
          };
        }
        if (child.type === ColumnLayout) {
          return {
            props: { class: styles.columnLayout, l: [2, 1], m: [1] },
            children: (grandChild) =>
              grandChild.type === AccentBox
                ? {
                    props: {
                      class: styles.accentBox,
                      backgroundColor: "neutral",
                    },
                  }
                : nestedHeadingRules(grandChild),
          };
        }
        if (child.type === ActionGroup) {
          /*
           * The footer is the deliberate way out, so its actions close
           * without asking again — the rule Flow's `Modal` writes for
           * `ActionGroup > Action`. An `Action` anywhere else in the modal is
           * an incidental close and is confirmed.
           */
          return {
            props: { class: styles.actionGroup, spacing: "m" },
            children: (grandChild) => {
              const props = withBypassedConfirmation(grandChild);
              return props ? { props } : undefined;
            },
          };
        }
        return undefined;
      };

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

        const texts = language.value?.startsWith("de")
          ? confirmCloseTexts["de-DE"]
          : confirmCloseTexts["en-US"];

        const children: VNode[] = applyChildRules(
          slots.default?.(),
          childRules,
        ).map((child) =>
          child.type === Heading
            ? withHeaderChrome(child, texts.close, props.showCloseButton)
            : child,
        );

        if (props.confirmOnClose) {
          children.push(h(ConfirmCloseModal, { parent: controller.value }));
        }

        /* A UI component: Flow clears the host's props context around it. */
        return h(ClearPropsContext, null, () =>
          h(
            OverlayContent,
            {
              class: className,
              isOpen: props.isOpen ?? controller.value.isOpen.value,
              isDismissable: props.isDismissable,
              "aria-labelledby": headingId,
              onOpenChange: controller.value.setOpen,
            },
            () => children,
          ),
        );
      };
    },
  }),
);

composition(ConfirmCloseModal);
composition(Modal);

export default Modal;
