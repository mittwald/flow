import { Children, type PropsWithChildren, type ReactElement } from "react";
import styles from "./Rating.module.scss";
import clsx from "clsx";
import * as Aria from "react-aria-components";
import { RatingSegment } from "@/components/Rating/components/RatingSegment";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";
import { useObjectRef } from "@react-aria/utils";
import { useMakeFocusable } from "@/lib/hooks/dom/useMakeFocusable";
import { UiComponentTunnelExit } from "@/components/UiComponentTunnel/UiComponentTunnelExit";
import { RatingSegmentContextProvider } from "@/components/Rating/context";

export interface RatingProps
  extends
    FlowComponentProps,
    PropsWithChildren,
    Omit<Aria.RadioGroupProps, "children" | "value" | "defaultValue"> {
  /** The value sets the amount of filled stars. @default: 0 */
  value?: number;
  /** The defaultValue sets the amount of default filled stars. @default: 0 */
  defaultValue?: number;
  /** The size of the component. @default: "m" */
  size?: "s" | "m";
  /**
   * The number of segments the rating consists of. Ignored when the rating has
   * `RatingSegment` children — those define the number of segments themselves.
   *
   * @default: 5
   */
  maxValue?: number;
  /**
   * How the segments are filled. `cumulative` fills every segment up to the
   * value, `single` fills only the selected segment.
   *
   * @default: cumulative
   */
  fill?: "cumulative" | "single";
  /** An alternative icon for the empty state */
  iconEmpty?: ReactElement;
  /** An alternative icon for the filled state */
  iconFilled?: ReactElement;
}

const segmentsTunnelId = "segments";

/**
 * @flr-generate all
 * @flr-slot-props iconEmpty, iconFilled
 */
export const Rating = flowComponent("Rating", (props) => {
  const {
    value,
    defaultValue = 0,
    size = "m",
    maxValue = 5,
    fill = "cumulative",
    className,
    children,
    ref,
    iconEmpty,
    iconFilled,
    ...rest
  } = props;

  const {
    FieldErrorView,
    FieldErrorCaptureContext,
    fieldProps,
    fieldPropsContext,
  } = useFieldComponent(props, "Rating");

  const rootClassName = clsx(
    styles.rating,
    styles[`size-${size}`],
    styles[`fill-${fill}`],
    fieldProps.className,
    className,
  );

  const localRef = useObjectRef(ref);

  useMakeFocusable(localRef);

  const segmentProps = { size, iconEmpty, iconFilled };

  const propsContext: PropsContext = {
    ...fieldPropsContext,
    RatingSegment: {
      ...segmentProps,
      tunnel: { id: segmentsTunnelId, component: "Rating" },
    },
  };

  const defaultSegments = Array.from({ length: maxValue }, (_, index) => (
    <RatingSegment key={index} {...segmentProps} />
  ));

  return (
    <Aria.RadioGroup
      {...rest}
      className={rootClassName}
      defaultValue={defaultValue.toString()}
      value={value?.toString()}
      ref={localRef}
    >
      <FieldErrorCaptureContext>
        <PropsContextProvider
          props={propsContext}
          dependencies={[size, iconEmpty, iconFilled]}
        >
          {children}
        </PropsContextProvider>
        <div className={styles.ratingSegments}>
          <UiComponentTunnelExit id={segmentsTunnelId} component="Rating">
            {(tunnelChildren) => {
              const tunneledSegments = Children.toArray(tunnelChildren);
              const segments =
                tunneledSegments.length > 0
                  ? tunneledSegments
                  : defaultSegments;

              return segments.map((segment, index) => (
                <RatingSegmentContextProvider
                  key={index}
                  value={{ value: index + 1, count: segments.length }}
                >
                  {segment}
                </RatingSegmentContextProvider>
              ));
            }}
          </UiComponentTunnelExit>
        </div>
      </FieldErrorCaptureContext>
      <FieldErrorView />
    </Aria.RadioGroup>
  );
});

export default Rating;
