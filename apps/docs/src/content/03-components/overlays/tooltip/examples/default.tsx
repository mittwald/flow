import Tooltip, {
  TooltipTrigger,
} from "@mittwald/flow-react-components/Tooltip";
import Button from "@mittwald/flow-react-components/Button";
import { IconEdit } from "@mittwald/flow-react-components/Icons";

<TooltipTrigger>
  <Button aria-label="Bearbeiten" variant="plain">
    <IconEdit />
  </Button>
  <Tooltip>Bearbeiten</Tooltip>
</TooltipTrigger>;
