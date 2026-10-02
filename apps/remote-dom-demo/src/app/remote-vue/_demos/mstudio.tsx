/** @jsxImportSource @/app/remote-vue/_lib */
import { TunnelEntry } from "@mittwald/flow-remote-vue-components";
import { defineComponent } from "vue";

/*
 * The Vue counterparts of `@mittwald/mstudio-ext-react-components`, which are
 * one `TunnelEntry` each: the extension marks a subtree, the host renders it in
 * its own page header. There is no Vue package for them yet, so the demo
 * defines them here.
 */
const tunnelComponent = (name: string, id: string) =>
  defineComponent({
    name,
    setup:
      (_props, { slots }) =>
      () => <TunnelEntry id={id}>{slots.default?.()}</TunnelEntry>,
  });

/** Overwrites the title of the host's current page. */
export const Title = tunnelComponent("Title", "@mstudio-ext/title");

/** `MenuItem` children become the host page's action menu. */
export const Actions = tunnelComponent("Actions", "@mstudio-ext/actions");

/** `Link` children become the host page's breadcrumb. */
export const Breadcrumb = tunnelComponent(
  "Breadcrumb",
  "@mstudio-ext/breadcrumb",
);
