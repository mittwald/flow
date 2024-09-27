import type { FC } from "react";

interface SampleProps {
  value: string;
}

export const PaddingSample: FC<SampleProps> = (props) => {
  const { value } = props;

  return (
    <div
      style={{
        borderRadius: "4px",
        backgroundColor: "gray",
        padding: value,
        width: "fit-content",
        border: "1px solid black",
      }}
    >
      <div
        style={{
          width: "24px",
          height: "24px",
          backgroundColor: "white",
          borderRadius: "4px",
        }}
      />
    </div>
  );
};
