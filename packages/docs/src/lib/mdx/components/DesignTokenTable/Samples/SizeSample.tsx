import type { FC } from "react";

interface SampleProps {
  value: string;
}

export const SizeSample: FC<SampleProps> = (props) => {
  const { value } = props;

  return (
    <div
      style={{
        width: value,
        height: value,
        backgroundColor: "black",
      }}
    />
  );
};
