/** @jsxImportSource @/app/remote-vue/_lib */
import { Heading, Section, Text } from "@mittwald/flow-remote-vue-components";
import { defineComponent } from "vue";

/**
 * Stands in for a demo that only exists as a React remote app: just
 * `react-hook-form`, a React form integration.
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
