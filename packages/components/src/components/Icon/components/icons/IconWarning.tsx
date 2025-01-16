/* auto-generated file */
import React, { type ComponentProps, type FC } from "react";
import { IconAlertCircle as Tabler } from "@tabler/icons-react";
import { Icon } from "~/components/Icon";
import { useViewComponents } from "~/lib/viewComponentContext/useViewComponent";

export const IconWarning: FC<Omit<ComponentProps<typeof Icon>, "children">> = (
  props,
) => {
  const { IconView } = useViewComponents(["Icon", Icon]);
  return (
    <IconView {...props}>
      <Tabler />
    </IconView>
  );
};
