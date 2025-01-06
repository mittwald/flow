import type { ComponentProps } from "react";
import React from "react";
import { ClearPropsContext } from "@/lib/propsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface ImageProps extends ComponentProps<"img">, FlowComponentProps {}

export const Image = flowComponent("Image", (props) => {
  const { ref, ...rest } = props;
  return (
    <ClearPropsContext>
      <img {...rest} ref={ref} />
    </ClearPropsContext>
  );
});

export default Image;
