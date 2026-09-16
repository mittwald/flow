import {
  AlertIcon,
  Heading,
  Icon,
  Section,
} from "@mittwald/flow-remote-vue-components";
import { iconApp, plainSvg } from "@/app/remote-vue/_demos/lib/icons";
import { defineComponent, h } from "vue";

/**
 * The Vue counterpart of `/remote/svg`.
 *
 * The React page renders a Flow icon, a Tabler icon and a raw `<svg>`. Only the
 * third has a Vue equivalent — Flow's icon sets are React components — so the
 * other two are drawn as SVG too. That an `<svg>` survives the boundary at all
 * is the point: it travels as remote DOM, not as a prop.
 */
export const SvgDemo = defineComponent({
  name: "SvgDemo",
  setup: () => () =>
    h(Section, null, () => [
      h(Heading, { level: 4 }, () => "AlertIcon (a remote component)"),
      h(AlertIcon, { status: "success" }),

      h(Heading, { level: 4 }, () => "An icon path, inside Icon"),
      h(Icon, null, () => iconApp()),

      h(Heading, { level: 4 }, () => "A plain SVG element"),
      h(Icon, null, () => plainSvg()),
    ]),
});
