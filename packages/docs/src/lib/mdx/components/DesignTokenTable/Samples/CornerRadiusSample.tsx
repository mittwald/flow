import type { FC } from "react";

interface SampleProps {
  value: string;
}

export const CornerRadiusSample: FC<SampleProps> = (props) => {
  const { value } = props;

  return (
    <div
      style={{
        width: "24px",
        height: "24px",
        border: "solid black",
        borderRadius: value,
      }}
    />
  );
};
