import type { FC } from "react";

interface SampleProps {
  value: string;
}

export const FontWeightSample: FC<SampleProps> = (props) => {
  const { value } = props;

  return (
    <div
      style={{
        fontWeight: value,
      }}
    >
      Aa
    </div>
  );
};
