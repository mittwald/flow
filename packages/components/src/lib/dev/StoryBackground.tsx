import React, { type FC, type PropsWithChildren } from "react";
import { isAlphaColor } from "@/lib/types/props";

interface Props extends PropsWithChildren {
  color?: string;
  theme: "dark" | "light";
}

export const StoryBackground: FC<Props> = (props) => {
  const { color, children, theme } = props;

  if (!color || !isAlphaColor(color)) {
    return children;
  }

  const showLightBackground =
    color === "dark" ||
    (color === "foreground-inverted" && theme === "dark") ||
    (color === "foreground" && theme === "light");

  return (
    <div
      style={{
        backgroundColor: showLightBackground ? "#E5EFF8" : "#3A434E",
        padding: 16,
        borderRadius: 16,
      }}
    >
      {children}
    </div>
  );
};
