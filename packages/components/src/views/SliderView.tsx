/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Slider, type SliderProps } from "@/components/Slider/Slider";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const SliderView: FC<SliderProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Slider"] ?? Slider;
  return <View {...props} />;
});
SliderView.displayName = "SliderView";

export default SliderView;
