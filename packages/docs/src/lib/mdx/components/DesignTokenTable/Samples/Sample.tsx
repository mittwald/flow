import type { FC } from "react";
import { TableCell } from "@mittwald/flow-react-components/Table";
import { ColorSample } from "@/lib/mdx/components/DesignTokenTable/Samples/ColorSample";
import { CornerRadiusSample } from "@/lib/mdx/components/DesignTokenTable/Samples/CornerRadiusSample";
import { SizeSample } from "@/lib/mdx/components/DesignTokenTable/Samples/SizeSample";
import { FontSizeSample } from "@/lib/mdx/components/DesignTokenTable/Samples/FontSizeSample";
import { PaddingSample } from "@/lib/mdx/components/DesignTokenTable/Samples/PaddingSample";

interface SampleProps {
  tokenName: string;
  tokenValue: string;
}

export const Sample: FC<SampleProps> = (props) => {
  const { tokenName, tokenValue } = props;

  let specificSample;

  if (tokenName.includes("color")) {
    specificSample = <ColorSample value={tokenValue} />;
  } else if (tokenName.includes("corner-radius")) {
    specificSample = <CornerRadiusSample value={tokenValue} />;
  } else if (tokenName.includes("font-size")) {
    specificSample = <FontSizeSample value={tokenValue} />;
  } else if (tokenName.includes("padding")) {
    specificSample = <PaddingSample value={tokenValue} />;
  } else if (
    tokenName.includes("width") ||
    tokenName.includes("spacing") ||
    tokenName.includes("size")
  ) {
    specificSample = <SizeSample value={tokenValue} />;
  }
  return <TableCell>{specificSample}</TableCell>;
};
