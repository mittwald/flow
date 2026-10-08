import {
  ActionGroup,
  Avatar,
  Button,
  Checkbox,
  Content,
  ContextMenu,
  ContextMenuTrigger,
  ContextualHelpTrigger,
  DialogTrigger,
  Heading,
  ListItemViewContent,
  Text,
} from "@/auto-generated";
import { IconChevronDown, IconChevronUp, IconContextMenu } from "@/icons";
import { watchMobxValue } from "@/lib/mobxSelector";
import { dynamic, withContextProps } from "@/overlays/childProps";
import { ModalTrigger, PopoverTrigger } from "@/overlays/triggers";
import {
  cloneVNode,
  defineComponent,
  Fragment,
  h,
  type Component,
  type VNode,
  type VNodeChild,
} from "vue";
import { injectItemAccordion, type ListItemAccordion } from "./itemContext";
import { injectListModel } from "./listContext";
import { useListTexts } from "./locales";
import { itemViewStyles, listStyles } from "./styles";
import { composition } from "@/lib/composition";

/* Flow's `overlayTriggersTunneledTo`: every trigger goes where the buttons go. */
const overlayTriggers = new Set<unknown>([
  ContextMenuTrigger,
  ContextualHelpTrigger,
  DialogTrigger,
  ModalTrigger,
  PopoverTrigger,
]);

/**
 * Where a child of `<ListItemView>` belongs.
 *
 * Flow's React version routes these with tunnels and a props context: a
 * `Heading` inside a list item ends up in the item's title slot without the
 * author saying so. A Vue app writes the same markup, and this is the routing —
 * one level deep, the way `mapChildren` reaches one level.
 */
const slotOfChild = (child: VNode): string | undefined => {
  const type = child.type as Component;

  if (type === Heading) {
    return "title";
  }
  if (type === Text) {
    return "subTitle";
  }
  if (type === Avatar) {
    return "avatar";
  }
  if (type === Checkbox) {
    return "checkbox";
  }
  if (
    type === Button ||
    type === ContextMenu ||
    type === ActionGroup ||
    overlayTriggers.has(type)
  ) {
    return "button";
  }
  if (type === Content && child.props?.slot === "bottom") {
    return "bottom";
  }

  return undefined;
};

const isVNode = (value: unknown): value is VNode =>
  typeof value === "object" && value !== null && "type" in value;

export const ListItemView = defineComponent({
  name: "ListItemView",

  setup(_props, { slots }) {
    const list = injectListModel();
    const viewMode = watchMobxValue(() => list.viewMode.value);
    const accordion = injectItemAccordion();
    const texts = useListTexts();

    /*
     * Flow's props context for the item's buttons. A bare `ContextMenu` needs
     * the button that opens it (`wrapWith: <OptionsButton/>`, plus `placement=
     * "bottom right"`) — without it the host renders a menu nobody can open,
     * which looks like nothing at all. A `Button` is `size="s"` in a tile and
     * `m` otherwise. An `ActionGroup` also gets what the `List`'s context sets
     * for every `ActionGroup` inside it.
     */
    const configureButton = (node: VNode): VNode => {
      if (node.type === Button) {
        return withContextProps(node, {
          size: dynamic(viewMode.value === "tiles" ? "s" : "m"),
        });
      }
      if (node.type === ActionGroup) {
        return withContextProps(node, {
          preserveOrder: true,
          class: listStyles.headerActions,
        });
      }
      if (node.type === ContextMenu) {
        return h(ContextMenuTrigger, null, () => [
          h(
            Button,
            {
              class: itemViewStyles.action,
              variant: "plain",
              color: "dark",
              "aria-label": texts.value("options"),
            },
            () => h(IconContextMenu),
          ),
          cloneVNode(node, { placement: "bottom right" }),
        ]);
      }
      return node;
    };

    /*
     * The toggle, and the rule that the expanded content is only in the tree
     * while it is open. Flow wraps the item's `Content slot="bottom"` with both
     * through a props context; here the item provides them and this injects
     * them.
     */
    const renderToggle = (current: ListItemAccordion): VNode =>
      h(
        Button,
        {
          class: itemViewStyles.action,
          variant: "plain",
          color: "secondary",
          "aria-label": texts.value(
            current.isExpanded.value
              ? "toggleExpandButton.collapse"
              : "toggleExpandButton.expand",
          ),
          "aria-controls": current.contentId,
          "aria-expanded": current.isExpanded.value,
          onPress: current.toggle,
        },
        () => h(current.isExpanded.value ? IconChevronUp : IconChevronDown),
      );

    return () => {
      const routed: Record<string, VNodeChild[]> = {};
      const rest: VNodeChild[] = [];

      const route = (node: unknown): void => {
        if (Array.isArray(node)) {
          node.forEach(route);
          return;
        }
        if (!isVNode(node)) {
          if (node !== null && node !== undefined && node !== "") {
            rest.push(node as VNodeChild);
          }
          return;
        }
        if (node.type === Fragment) {
          route(node.children);
          return;
        }

        const slot = slotOfChild(node);
        if (slot === "button") {
          (routed.button ??= []).push(configureButton(node));
        } else if (slot) {
          (routed[slot] ??= []).push(node);
        } else {
          rest.push(node);
        }
      };

      route(slots.default?.());

      /* An explicit named slot wins — it says where the content goes. */
      for (const name of [
        "title",
        "subTitle",
        "avatar",
        "button",
        "checkbox",
        "bottom",
      ]) {
        const slot = slots[name];
        if (slot) {
          routed[name] = [slot()];
        }
      }

      /*
       * After the item's own buttons, wherever its content was written. An
       * item with nothing to expand gets no toggle.
       */
      const toggle = accordion && routed.bottom ? accordion : undefined;
      if (toggle) {
        (routed.button ??= []).push(renderToggle(toggle));

        if (toggle.isExpanded.value) {
          /* What the toggle's `aria-controls` points at. */
          routed.bottom = (routed.bottom ?? []).map((node) =>
            isVNode(node) ? cloneVNode(node, { id: toggle.contentId }) : node,
          );
        } else {
          delete routed.bottom;
        }
      }

      const slotFor = (name: string) => {
        const nodes = routed[name];
        return nodes ? () => nodes : undefined;
      };

      return h(
        ListItemViewContent,
        /* Vue passes `class` and the rest through to this single root itself. */
        { viewMode: viewMode.value },
        {
          default: () => rest,
          title: slotFor("title"),
          subTitle: slotFor("subTitle"),
          avatar: slotFor("avatar"),
          button: slotFor("button"),
          checkbox: slotFor("checkbox"),
          bottom: slotFor("bottom"),
        },
      );
    };
  },
});

composition(ListItemView);

export default ListItemView;
