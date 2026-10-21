/** @jsxImportSource @/app/remote-vue/_lib */
import {
  Header,
  Heading,
  Section,
  SkeletonMode,
  Switch,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent, ref } from "vue";

/**
 * The Vue counterpart of
 * `src/app/remote/components/_lib/ComponentGroupPage.tsx`: one example per
 * component of a docs group, and a switch that puts the whole page into
 * skeleton mode.
 */
export const ComponentGroupPage = defineComponent({
  name: "ComponentGroupPage",
  props: {
    title: { type: String, required: true },
  },
  setup(props, { slots }) {
    const isSkeleton = ref(false);

    return () => (
      <Section>
        <Header>
          <Heading>{props.title}</Heading>
          <Switch
            isSelected={isSkeleton.value}
            onChange={(value: boolean) => (isSkeleton.value = value)}
          >
            Skeleton mode
          </Switch>
        </Header>
        <SkeletonMode isEnabled={isSkeleton.value}>
          {slots.default?.()}
        </SkeletonMode>
      </Section>
    );
  },
});
