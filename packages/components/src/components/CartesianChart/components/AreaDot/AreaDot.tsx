import type { FC } from "react";
import type * as Recharts from "recharts";
import { useDesignTokens } from "@/lib/theming";

export interface AreaDotProps extends Recharts.DotProps {
  color: string;
}

export const AreaDot: FC<AreaDotProps> = ({ cx, cy, color }) => {
  const tokens = useDesignTokens();

  if (cx === undefined || cy === undefined) return null;

  const backgroundColor = tokens.area["dot-background-color"].value;

  return (
    <svg
      x={cx - 7}
      y={cy - 7}
      width={14}
      height={14}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="7" cy="7" r="7" fill={backgroundColor} />
      <circle
        cx="7"
        cy="7"
        r="4"
        stroke={color}
        strokeWidth="2"
        fill={backgroundColor}
      />
    </svg>
  );
};

export default AreaDot;
