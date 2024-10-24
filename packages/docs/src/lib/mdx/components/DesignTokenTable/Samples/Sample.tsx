import type { FC } from "react";
import { TableCell } from "@mittwald/flow-react-components/Table";
import { ColorSample } from "@/lib/mdx/components/DesignTokenTable/Samples/ColorSample";
import { CornerRadiusSample } from "@/lib/mdx/components/DesignTokenTable/Samples/CornerRadiusSample";
import { SizeSample } from "@/lib/mdx/components/DesignTokenTable/Samples/SizeSample";
import { FontSizeSample } from "@/lib/mdx/components/DesignTokenTable/Samples/FontSizeSample";
import { PaddingSample } from "@/lib/mdx/components/DesignTokenTable/Samples/PaddingSample";
import { MarginSample } from "@/lib/mdx/components/DesignTokenTable/Samples/MarginSample";
import { BorderStyleSample } from "@/lib/mdx/components/DesignTokenTable/Samples/BorderStyleSample";
import { BorderWidthSample } from "@/lib/mdx/components/DesignTokenTable/Samples/BorderWidthSample";
import { FontWeightSample } from "@/lib/mdx/components/DesignTokenTable/Samples/FontWeightSample";
import { LineHeightSample } from "@/lib/mdx/components/DesignTokenTable/Samples/LineHeightSample";

interface SampleProps {
  tokenName: string;
  tokenValue: string;
}

export const Sample: FC<SampleProps> = (props) => {
  const { tokenName, tokenValue } = props;

  switch (true) {
    case tokenName.includes("color"):
      return <ColorSample value={tokenValue} />;
    case tokenName.includes("corner-radius"):
      return <CornerRadiusSample value={tokenValue} />;
    case tokenName.includes("font-size"):
      return <FontSizeSample value={tokenValue} />;
    case tokenName.includes("font-weight"):
      return <FontWeightSample value={tokenValue} />;
    case tokenName.includes("line-height"):
      return <LineHeightSample value={tokenValue} />;
    case tokenName.includes("padding"):
      return <PaddingSample value={tokenValue} />;
    case tokenName.includes("margin"):
      return <MarginSample value={tokenValue} />;
    case tokenName.includes("border-style"):
      return <BorderStyleSample value={tokenValue} />;
    case tokenName.includes("border-width"):
      return <BorderWidthSample value={tokenValue} />;
    case tokenName.includes("width") ||
      tokenName.includes("spacing") ||
      tokenName.includes("size"):
      return <SizeSample value={tokenValue} />;
  }
};
