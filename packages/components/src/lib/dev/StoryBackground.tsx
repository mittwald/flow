import React, { type FC, type PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  color?: string;
  theme: "dark" | "light";
}

export const StoryBackground: FC<Props> = (props) => {
  const { color, children, theme } = props;

  const showLight =
    (color === "dark" && theme === "light") ||
    (color === "light" && theme === "dark");

  return (
    <div
      style={{
        backgroundColor: !color ? undefined : showLight ? "#E5EFF8" : "#3A434E",
        padding: color ? 16 : undefined,
        borderRadius: color ? 16 : undefined,
      }}
    >
      {children}
    </div>
  );
};
