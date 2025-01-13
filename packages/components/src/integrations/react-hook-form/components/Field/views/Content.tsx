import type { FC, PropsWithChildren } from "react";
import React from "react";
import { FieldError } from "@/components/FieldError";

export interface ContentProps extends PropsWithChildren {
  errorMessage?: string;
}

/** @flr-generate all */
export const Content: FC<ContentProps> = (props) => {
  const { children, errorMessage } = props;

  return (
    <>
      {children}
      <FieldError>{errorMessage}</FieldError>
    </>
  );
};

export default Content;
