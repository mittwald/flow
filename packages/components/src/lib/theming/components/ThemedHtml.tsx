import type { FC, HTMLAttributes } from "react";
import type { Theme } from "../types";
import { themeHtmlAttribute } from "../lib/keys";

interface Props extends HTMLAttributes<HTMLHtmlElement> {
  theme: Theme;
}

export const ThemedHtml: FC<Props> = (props) => {
  const { theme, ...rest } = props;

  return (
    <html {...{ [themeHtmlAttribute]: theme }} {...rest}>
      {props.children}
    </html>
  );
};
