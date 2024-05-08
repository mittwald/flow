import Tooltip, {
  TooltipTrigger,
} from "@mittwald/flow-react-components/Tooltip";
import Button from "@mittwald/flow-react-components/Button";
import { IconCopy } from "@mittwald/flow-react-components/Icons";

<TooltipTrigger>
  <Button aria-label="Speichern">
    <IconCopy />
  </Button>
  <Tooltip>Speichern</Tooltip>
</TooltipTrigger>;
