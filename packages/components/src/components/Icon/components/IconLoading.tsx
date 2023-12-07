import React, { FC } from "react";
import { Icon } from "@/components";
import { faHourglass } from "@fortawesome/free-regular-svg-icons/faHourglass";

export const IconLoading: FC = () => {
  return <Icon faIcon={faHourglass} faAnimation="spin" />;
};

export default IconLoading;
