import {
  ActionGroup,
  Button,
  ClearPropsContext,
  Div,
  LightBoxGallery,
  OverlayContent,
} from "@/auto-generated";
import Action from "@/components/Action";
import ActionBatch from "@/components/ActionBatch";
import { useLanguage } from "@/composables/remoteContext";
import { IconClose } from "@/icons";
import {
  applyChildRules,
  flattenChildren,
  type ChildRules,
} from "@/overlays/childProps";
import {
  provideOverlayContext,
  useOwnController,
  useOverlayHandlers,
  type OverlayCloseHandler,
  type OverlayController,
  type OverlayOpenHandler,
  type OverlayOpenStateHandler,
} from "@/overlays/overlayController";
import { markAsOverlay } from "@/overlays/overlayRegistry";
import { defineComponent, h, onMounted, type PropType, type VNode } from "vue";
import { composition } from "@/lib/composition";
import { useComponentUsage } from "@/composables/useComponentUsage";

/* Flow's own class names — see the note in Modal.ts. */
const styles = {
  overlay: "flow--overlay",
  lightBox: "flow--light-box",
  fitScreen: "flow--light-box--fit-screen",
  content: "flow--light-box--content",
  actions: "flow--light-box--actions",
  actionGroup: "flow--light-box--action-group",
  gallery: "flow--light-box--gallery",
};

/* From `packages/components/src/components/LightBox/locales/*.locale.json`. */
const closeTexts = { "de-DE": "Schließen", "en-US": "Close" };

const lightStaticButton = { variant: "solid", color: "light-static" } as const;

/* Flow's `ActionGroup: { Button: … }`, through the actions inside it too. */
const buttonRules: ChildRules = (child) =>
  child.type === Button
    ? { props: lightStaticButton }
    : child.type === Action || child.type === ActionBatch
      ? { children: buttonRules }
      : undefined;

const childRules: ChildRules = (child) =>
  child.type === ActionGroup
    ? {
        props: {
          class: styles.actionGroup,
          spacing: "m",
          preserveOrder: true,
        },
        children: buttonRules,
      }
    : child.type === LightBoxGallery
      ? { props: { class: styles.gallery } }
      : undefined;

export const LightBox = markAsOverlay(
  defineComponent({
    name: "LightBox",

    inheritAttrs: false,

    props: {
      /** Whether content may exceed the available screen space. @default true */
      fitScreen: { type: Boolean, default: true },
      /** A controller to open and close the light box from anywhere. */
      controller: {
        type: Object as PropType<OverlayController>,
        default: undefined,
      },
      /** Whether a click outside closes the light box. @default true */
      isDismissable: { type: Boolean, default: true },
      /** Whether the light box is open. Use it to control its state. */
      isOpen: { type: Boolean, default: undefined },
      onOpen: {
        type: Function as PropType<OverlayOpenHandler>,
        default: undefined,
      },
      onClose: {
        type: Function as PropType<OverlayCloseHandler>,
        default: undefined,
      },
      onOpenChange: {
        type: Function as PropType<OverlayOpenStateHandler>,
        default: undefined,
      },
    },

    setup(props, { slots, attrs }) {
      /* Flow's React `LightBox` is a `flowComponent` and reports itself. */
      onMounted(useComponentUsage("LightBox"));

      const language = useLanguage();
      const controller = useOwnController(() => props.controller, "LightBox");

      /* Registered as a `Modal`, as Flow's `Overlay` registers it. */
      provideOverlayContext("Modal", () => controller.value);

      useOverlayHandlers(() => controller.value, {
        onOpen: () => props.onOpen,
        onClose: () => props.onClose,
        onOpenChange: () => props.onOpenChange,
      });

      return () => {
        const className = [
          styles.overlay,
          styles.lightBox,
          props.fitScreen ? styles.fitScreen : undefined,
          attrs.class,
        ]
          .filter(Boolean)
          .join(" ");

        /*
         * Flow tunnels the `ActionGroup` out of the content into the actions,
         * behind the close button.
         */
        const children = applyChildRules(slots.default?.(), childRules);
        const isActionGroup = (child: VNode) => child.type === ActionGroup;
        const actionGroups = flattenChildren(children).filter(isActionGroup);
        const content = flattenChildren(children).filter(
          (child) => !isActionGroup(child),
        );

        const closeButton = h(
          Button,
          {
            ...lightStaticButton,
            "aria-label": language.value?.startsWith("de")
              ? closeTexts["de-DE"]
              : closeTexts["en-US"],
            onPress: () => controller.value.close(),
          },
          () => h(IconClose),
        );

        /* A UI component: Flow clears the host's props context around it. */
        return h(ClearPropsContext, null, () =>
          h(
            OverlayContent,
            {
              class: className,
              isOpen: props.isOpen ?? controller.value.isOpen.value,
              isDismissable: props.isDismissable,
              onOpenChange: controller.value.setOpen,
            },
            () => [
              h(Div, { class: styles.content }, () => content),
              h(Div, { class: styles.actions }, () => [
                closeButton,
                ...actionGroups,
              ]),
            ],
          ),
        );
      };
    },
  }),
);

composition(LightBox);

export default LightBox;
