import type { FC, PropsWithChildren } from "react";
import { useSetChildProps } from "@/lib/childProps";

export interface StepProps extends PropsWithChildren {
  id: string;
}

export const Step: FC<StepProps> = (props) => {
  useSetChildProps("steps", props);

  return null;
};

export default Step;
