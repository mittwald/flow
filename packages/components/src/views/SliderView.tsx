/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { SliderProps } from "@/components/Slider";
import React, { useContext } from "react";
import { Slider } from "@/components/Slider";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const SliderView: FC<SliderProps> = (props) => {
  const View = useContext(viewComponentContext)["Slider"] ?? Slider;
  return <View {...props} />;
};

export default SliderView;
