import React, { FC } from "react";
import Icon, { IconProps } from "@/components/Icon";

export const IconMittwald: FC<IconProps> = (props) => {
  return (
    <Icon {...props}>{`
<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 1746.7 1232" focusable="false" role="img" aria-hidden="true">
  <path d="M1117.2,285.4c-102.5,0-226.5,52.1-291.3,160c-46.7-100.7-134.8-160-276.9-160 c-101.4,0-201.2,50.8-256.1,124.1l-29.8-151.3L17.4,306.3l29.9,152.2l0.1,2.4l-0.1,741.3h240.9V736.7 c0-118.7,61.1-222.9,183.4-222.9C601,513.8,628,601.9,628,720.6v481.8h240.9V727.7c0-118.7,64.7-213.9,183.4-213.9 c127.6,0,156.4,88.1,156.4,206.8v499.8l240.9-47.2V690C1449.8,459.8,1370.7,285.4,1117.2,285.4z"></path>
  <path  d="M1569.2,23.7c-83,0-152.4,69.5-152.4,154.3c0,83,69.5,152.4,152.4,152.4c84.9,0,154.4-69.5,154.4-152.4 C1723.5,93.1,1654.1,23.7,1569.2,23.7z"></path>
</svg>`}</Icon>
  );
};

export default IconMittwald;
