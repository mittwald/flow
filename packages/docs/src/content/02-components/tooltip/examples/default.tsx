import React from "react";
import Tooltip, {
  TooltipTrigger,
} from "@mittwald/flow-next-components/Tooltip";
import Button from "@mittwald/flow-next-components/Button";
import Icon from "@mittwald/flow-next-components/Icon";
import { faSave } from "@fortawesome/free-regular-svg-icons/faSave";

<TooltipTrigger>
  <Button aria-label="save">
    <Icon faIcon={faSave} />
  </Button>
  <Tooltip>Save</Tooltip>
</TooltipTrigger>;
