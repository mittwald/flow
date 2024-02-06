import Tooltip, {
  TooltipTrigger,
} from "@mittwald/flow-react-components/Tooltip";
import Button from "@mittwald/flow-react-components/Button";
import Icon from "@mittwald/flow-react-components/Icon";
import { faSave } from "@fortawesome/free-regular-svg-icons/faSave";

<TooltipTrigger>
  <Button aria-label="save">
    <Icon faIcon={faSave} />
  </Button>
  <Tooltip>Save</Tooltip>
</TooltipTrigger>;
