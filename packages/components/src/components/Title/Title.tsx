import { Heading, HeadingProps } from "@/components/Heading";
import React, { FC } from "react";

export interface TitleProps extends Omit<HeadingProps, "slot"> {}

export const Title: FC<TitleProps> = (props) => {
  const { children, level = 2, ...rest } = props;

  return (
    <Heading level={2} {...rest} slot="title">
      {children}
    </Heading>
  );
};

export default Title;
