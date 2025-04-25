/* prettier-ignore */
/* This file is auto-generated with the remote-components-generator */
import type { FC } from "react";
import type { SectionProps } from "@/components/Section";
import React, { useContext } from "react";
import { Section } from "@/components/Section";
import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";

const SectionView: FC<SectionProps> = (props) => {
  const View = useContext(viewComponentContext)["Section"] ?? Section;
  return <View {...props} />;
};

export default SectionView;
