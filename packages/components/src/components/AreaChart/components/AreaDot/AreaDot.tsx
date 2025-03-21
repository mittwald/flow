import type { FC } from "react";
import type * as Recharts from "recharts";

export const AreaDot: FC<Recharts.DotProps & { color: string }> = ({
  cx,
  cy,
  color,
}) => {
  if (cx === undefined || cy === undefined) return null;

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
      <circle cx="7" cy="7" r="7" fill="white" />
      <circle cx="7" cy="7" r="4" stroke={color} strokeWidth="2" fill="white" />
    </svg>
  );
};
