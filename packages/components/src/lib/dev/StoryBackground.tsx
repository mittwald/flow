import React, { type FC, type PropsWithChildren } from "react";
import { isAlphaColor } from "@/lib/types/props";

interface Props extends PropsWithChildren {
  color?: string;
}

export const StoryBackground: FC<Props> = (props) => {
  const { color, children } = props;

  if (!color || !isAlphaColor(color)) {
    return children;
  }

  return (
    <div
      style={{
        backgroundColor:
          color === "dark" || color === "static-dark" ? "#E5EFF8" : "#3A434E",
        padding: 16,
        borderRadius: 16,
      }}
    >
      {children}
    </div>
  );
};
