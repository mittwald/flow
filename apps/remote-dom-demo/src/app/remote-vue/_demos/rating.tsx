/** @jsxImportSource @/app/remote-vue/_lib */
import {
  Flex,
  Heading,
  Icon,
  Label,
  Rating,
  RatingSegment,
} from "@mittwald/flow-remote-vue-components";
import {
  iconMoodEmpty,
  iconMoodEmptyFilled,
  iconMoodHappy,
  iconMoodHappyFilled,
  iconMoodSad,
  iconMoodSadFilled,
} from "@/app/remote-vue/_demos/lib/icons";
import { defineComponent, type VNode } from "vue";

interface SegmentOptions {
  label: string;
  color: string;
  icon: () => VNode;
  iconFilled: () => VNode;
}

/*
 * `iconEmpty` and `iconFilled` are `ReactNode` props on the Flow component, so
 * the generator made them slots — which is what lets a whole subtree cross the
 * boundary. As remote properties they would be dropped by structured clone.
 */
const segment = ({ label, color, icon, iconFilled }: SegmentOptions) => (
  <RatingSegment aria-label={label}>
    {{
      iconEmpty: () => <Icon>{icon()}</Icon>,
      iconFilled: () => <Icon color={color}>{iconFilled()}</Icon>,
    }}
  </RatingSegment>
);

/** The Vue counterpart of `/remote/rating`. */
export const RatingDemo = defineComponent({
  name: "RatingDemo",
  setup: () => () => (
    <Flex direction="column" gap="l">
      <Heading>Default</Heading>
      <Rating defaultValue={2}>
        <Label>Cantina rating</Label>
      </Rating>

      <Heading>Segments with single fill</Heading>
      <Rating fill="single" defaultValue={2}>
        <Label>How was your meal at the cantina?</Label>
        {segment({
          label: "Terrible",
          color: "danger",
          icon: iconMoodSad,
          iconFilled: iconMoodSadFilled,
        })}
        {segment({
          label: "Okay",
          color: "warning",
          icon: iconMoodEmpty,
          iconFilled: iconMoodEmptyFilled,
        })}
        {segment({
          label: "Great",
          color: "success",
          icon: iconMoodHappy,
          iconFilled: iconMoodHappyFilled,
        })}
      </Rating>
    </Flex>
  ),
});
