import Tooltip, {
  TooltipTrigger,
} from "@mittwald/flow-react-components/Tooltip";
import Button from "@mittwald/flow-react-components/Button";
import { IconCopy } from "@mittwald/flow-react-components/Icons";

<TooltipTrigger>
  <Button aria-label="save">
    <IconCopy />
  </Button>
  <Tooltip>Save</Tooltip>
</TooltipTrigger>;
