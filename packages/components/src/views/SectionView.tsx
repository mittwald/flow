/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import React, { memo, type FC, useContext } from "react";
import { Section, type SectionProps } from "@/components/Section";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const SectionView: FC<SectionProps> = memo((props) => {
  const View = useContext(viewComponentContext)["Section"] ?? Section;
  return <View {...props} />;
});
SectionView.displayName = "SectionView";

export default SectionView;
