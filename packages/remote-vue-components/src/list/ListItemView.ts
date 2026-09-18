import {
  ActionGroup,
  Avatar,
  Button,
  Checkbox,
  Content,
  ContextMenu,
  ContextMenuTrigger,
  Heading,
  ListItemViewContent,
  Text,
} from "@/auto-generated";
import { watchMobxValue } from "@/lib/mobxSelector";
import {
  defineComponent,
  Fragment,
  h,
  type Component,
  type VNode,
  type VNodeChild,
} from "vue";
import { injectListModel } from "./listContext";

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
    type === ContextMenuTrigger ||
    type === ActionGroup
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
        if (slot) {
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

export default ListItemView;
