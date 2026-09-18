import type { RemoteIconElementProps } from "@mittwald/flow-remote-elements";
import type { FlowRemoteProps } from "./types.js";

/**
 * What a generated icon takes: `Icon`'s props, minus its children — the `<svg>`
 * is the icon's own and is not replaceable, exactly as in React
 * (`Omit<ComponentProps<typeof Icon>, "children">`).
 *
 * So `size` is `Icon`'s `"s" | "m" | "l"`, not a pixel count.
 */
export type FlowIconProps = Omit<
  FlowRemoteProps<RemoteIconElementProps>,
  "children"
>;
