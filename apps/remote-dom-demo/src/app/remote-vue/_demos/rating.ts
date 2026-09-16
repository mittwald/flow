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
  iconMoodHappy,
  iconMoodSad,
} from "@/app/remote-vue/_demos/lib/icons";
import { defineComponent, h, type VNode } from "vue";

interface SegmentOptions {
  label: string;
  color: string;
  icon: () => VNode;
}

/*
 * `iconEmpty` and `iconFilled` are `ReactNode` props on the Flow component, so
 * the generator made them slots — which is what lets a whole subtree cross the
 * boundary. As remote properties they would be dropped by structured clone.
 */
const segment = ({ label, color, icon }: SegmentOptions) =>
  h(
    RatingSegment,
    { "aria-label": label },
    {
      iconEmpty: () => h(Icon, null, () => icon()),
      iconFilled: () => h(Icon, { color }, () => icon()),
    },
  );

/** The Vue counterpart of `/remote/rating`. */
export const RatingDemo = defineComponent({
  name: "RatingDemo",
  setup: () => () =>
    h(Flex, { direction: "column", gap: "l" }, () => [
      h(Heading, null, () => "Default"),
      h(Rating, { defaultValue: 2 }, () =>
        h(Label, null, () => "Cantina rating"),
      ),

      h(Heading, null, () => "Segments with single fill"),
      h(Rating, { fill: "single", defaultValue: 2 }, () => [
        h(Label, null, () => "How was your meal at the cantina?"),
        segment({ label: "Terrible", color: "danger", icon: iconMoodSad }),
        segment({ label: "Okay", color: "warning", icon: iconMoodEmpty }),
        segment({ label: "Great", color: "success", icon: iconMoodHappy }),
      ]),
    ]),
});
