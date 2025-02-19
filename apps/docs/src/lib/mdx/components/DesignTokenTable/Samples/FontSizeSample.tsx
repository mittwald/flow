import type { FC } from "react";

interface SampleProps {
  value: string;
}

export const FontSizeSample: FC<SampleProps> = (props) => {
  const { value } = props;

  return (
    <div
      style={{
        fontSize: value,
      }}
    >
      Aa
    </div>
  );
};
