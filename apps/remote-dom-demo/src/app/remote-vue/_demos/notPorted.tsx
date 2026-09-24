/** @jsxImportSource @/app/remote-vue/_lib */
import { Heading, Section, Text } from "@mittwald/flow-remote-vue-components";
import { defineComponent } from "vue";

/**
 * Stands in for a demo that only exists as a React remote app. Three do:
 * `react-hook-form` and `server-actions` are a React form integration and a
 * Next server action, and `coach-mark` closes its overlay with `<Action
 * closeOverlay="CoachMark">` — a target named by component, which the Vue
 * `Action` does not resolve (it closes the overlay it sits in).
 *
 * Rendered instead of nothing so the Vue app stays mounted while the host
 * navigates: unmounting would drop the connection, and the next demo would have
 * to announce a second remote root to the same host.
 */
export const NotPortedDemo = defineComponent({
  name: "NotPortedDemo",
  setup: () => () => (
    <Section>
      <Heading>Not ported yet</Heading>
      <Text>
        This demo exists as a React remote app only — it needs something the Vue
        binding does not carry. The package&apos;s README lists the gaps.
      </Text>
    </Section>
  ),
});
