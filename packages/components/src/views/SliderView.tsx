/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { type FC, useContext } from "react";
import { Slider, type SliderProps } from "~/components/Slider";
import { viewComponentContext } from "~/lib/viewComponentContext/viewComponentContext";

const SliderView: FC<SliderProps> = (props) => {
  const View = useContext(viewComponentContext)["Slider"] ?? Slider;
  return <View {...props} />;
};

export default SliderView;
