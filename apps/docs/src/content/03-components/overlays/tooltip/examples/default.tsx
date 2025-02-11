import {
  Tooltip,
  TooltipTrigger,
} from "@mittwald/flow-react-components";
import { Button } from "@mittwald/flow-react-components";
import { IconEdit } from "@mittwald/flow-react-components";

<TooltipTrigger>
  <Button aria-label="Bearbeiten" variant="plain">
    <IconEdit />
  </Button>
  <Tooltip>Bearbeiten</Tooltip>
</TooltipTrigger>;
