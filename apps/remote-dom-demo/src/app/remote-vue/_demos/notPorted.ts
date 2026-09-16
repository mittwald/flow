import { Heading, Section, Text } from "@mittwald/flow-remote-vue-components";
import { defineComponent, h } from "vue";

/**
 * Stands in for a demo that only exists as a React remote app: `list`,
 * `list-selection`, `react-hook-form` and `server-actions`. The first two need
 * Flow's `List`, which has no Vue rebuild; the others are React and Next form
 * integrations with no Vue counterpart.
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
          "This demo exists as a React remote app only — it needs Flow's List, react-hook-form or a Next server action, none of which have a Vue counterpart.",
      ),
    ]),
});
