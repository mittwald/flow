import type { FC } from "react";

interface ColorSampleProps {
  value: string;
}

export const ColorSample: FC<ColorSampleProps> = (props) => {
  const { value } = props;

  return (
    <div
      style={{
        width: "24px",
        height: "24px",
        backgroundColor: value,
        borderRadius: "4px",
      }}
    />
  );
};
