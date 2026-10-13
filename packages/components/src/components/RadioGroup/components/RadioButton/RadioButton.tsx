import styles from "./RadioButton.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { RadioProps } from "@/components/RadioGroup";
import { Radio } from "@/components/RadioGroup";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import {
  SkeletonModeReset,
  useSkeletonMode,
} from "@/components/SkeletonMode/skeletonModeContext";

export type RadioButtonProps = RadioProps;

/** @flr-generate all */
export const RadioButton = flowComponent("RadioButton", (props) => {
  const { children, className, ref, ...rest } = props;

  const isSkeleton = useSkeletonMode();

  const rootClassName = clsx(styles.radioButton, className);

  const propsContext: PropsContext = {
    Text: {
      className: styles.label,
    },
    Content: {
      className: styles.content,
    },
  };

  const radio = (
    <Radio {...rest} className={rootClassName} ref={ref}>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </Radio>
  );

  /* The whole button is the surface, its content draws no bars. */
  return isSkeleton ? <SkeletonModeReset>{radio}</SkeletonModeReset> : radio;
});

export default RadioButton;
