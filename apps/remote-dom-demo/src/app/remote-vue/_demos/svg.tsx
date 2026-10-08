/** @jsxImportSource @/app/remote-vue/_lib */
import {
  AlertIcon,
  Heading,
  Icon,
  Section,
} from "@mittwald/flow-remote-vue-components";
import { iconApp, plainSvg } from "@/app/remote-vue/_demos/lib/icons";
import { defineComponent } from "vue";

/**
 * The Vue counterpart of `/remote/svg`.
 *
 * The React page renders `AlertIcon`, a Tabler icon from `@tabler/icons-react`
 * and a raw `<svg>`. `AlertIcon` is the same remote component here. Tabler has
 * no Vue package in this repository, so its icon is drawn by hand
 * (`lib/icons.ts`) — a raw `<svg>` inside `Icon`, the way an extension brings
 * any icon outside Flow's set. That an `<svg>` survives the boundary at all is
 * the point: it travels as remote DOM, not as a prop.
 */
export const SvgDemo = defineComponent({
  name: "SvgDemo",
  setup: () => () => (
    <Section>
      <Heading level={4}>AlertIcon (a remote component)</Heading>
      <AlertIcon status="success" />

      <Heading level={4}>An icon path, inside Icon</Heading>
      <Icon>{iconApp()}</Icon>

      <Heading level={4}>A plain SVG element</Heading>
      <Icon>{plainSvg()}</Icon>
    </Section>
  ),
});
