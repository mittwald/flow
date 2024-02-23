import { IconStar } from "@tabler/icons-react";
import React, { ReactElement } from "react";

export type IconAlias = "project" | "server";

export const getIconByAlias = (iconAlias: IconAlias): ReactElement => {
  switch (iconAlias) {
    case "project":
      return <IconStar />;
    default:
      return <IconStar />;
  }
};
