import { useRef, type FC, type Ref } from "react";
import * as Aria from "react-aria-components";

interface DateInputProps extends Omit<Aria.DateInputProps, "children" | "ref"> {
  ref?: Ref<HTMLSpanElement | null>;
}

export const DateInput: FC<DateInputProps> = (props) => {
  const { ref, ...inputProps } = props;

  const firstSegmentType = useRef<string | null>(null);

  return (
    <Aria.DateInput {...inputProps}>
      {(segment) => {
        if (firstSegmentType.current === null && segment.type !== "literal") {
          firstSegmentType.current = segment.type;
        }

        const firstSegmentRef =
          segment.type === firstSegmentType.current ? ref : null;

        return <Aria.DateSegment segment={segment} ref={firstSegmentRef} />;
      }}
    </Aria.DateInput>
  );
};

export default DateInput;
