import { Heading, Section, Text } from "@mittwald/flow-remote-vue-components";
import { defineComponent, h } from "vue";

/**
 * Stands in for a demo that only exists as a React remote app:
 * `list-selection`, `react-hook-form` and `server-actions`. The first needs the
 * List's selection, which the Vue rebuild does not carry yet; the others are
 * React and Next form integrations with no Vue counterpart.
 *
 * Rendered instead of nothing so the Vue app stays mounted while the host
 * navigates: unmounting would drop the connection, and the next demo would have
 * to announce a second remote root to the same host.
 */
export const NotPortedDemo = defineComponent({
  name: "NotPortedDemo",
  setup: () => () =>
    h(Section, null, () => [
      h(Heading, null, () => "Not ported yet"),
      h(
        Text,
        null,
        () =>
          "This demo exists as a React remote app only — it needs the List's selection, react-hook-form or a Next server action, none of which have a Vue counterpart.",
      ),
    ]),
});
