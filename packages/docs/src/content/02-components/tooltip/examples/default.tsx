import Tooltip, {
  TooltipTrigger,
} from "@mittwald/flow-react-components/Tooltip";
import Button from "@mittwald/flow-react-components/Button";
import Icon from "@mittwald/flow-react-components/Icon";

<TooltipTrigger>
  <Button aria-label="save">
    <Icon name="copy" />
  </Button>
  <Tooltip>Save</Tooltip>
</TooltipTrigger>;
