import type { FC } from "react";
import { TableCell } from "@mittwald/flow-react-components/Table";
import { ColorSample } from "@/lib/mdx/components/DesignTokenTable/Samples/ColorSample";
import { CornerRadiusSample } from "@/lib/mdx/components/DesignTokenTable/Samples/CornerRadiusSample";

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
  }
  return <TableCell>{specificSample}</TableCell>;
};
