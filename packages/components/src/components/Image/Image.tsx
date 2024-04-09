import type { ComponentProps } from "react";
import React from "react";
import { ClearPropsContext } from "@/lib/propsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface ImageProps extends ComponentProps<"img">, FlowComponentProps {}

export const Image = flowComponent("Image", (props) => {
  const propsWithContext = props;
  return (
    <ClearPropsContext>
      <img {...propsWithContext} />
    </ClearPropsContext>
  );
});

export default Image;
