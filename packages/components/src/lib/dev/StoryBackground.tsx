import React, { type FC, type PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  color?: string;
}

export const StoryBackground: FC<Props> = (props) => {
  const { color, children } = props;

  return (
    <div
      style={{
        backgroundColor:
          color === "dark"
            ? "#E5EFF8"
            : color === "light"
              ? "#3A434E"
              : undefined,
        padding: color === "dark" || color === "light" ? 16 : undefined,
        borderRadius: color === "dark" || color === "light" ? 16 : undefined,
      }}
    >
      {children}
    </div>
  );
};
