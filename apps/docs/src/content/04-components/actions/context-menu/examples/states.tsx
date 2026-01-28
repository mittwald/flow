import {
  Button,
  ContextMenu,
  ContextMenuTrigger,
  MenuItem,
} from "@mittwald/flow-react-components";

<ContextMenuTrigger>
  <Button>Trigger</Button>
  <ContextMenu>
    <MenuItem isDisabled>Disabled</MenuItem>
    <MenuItem isPending>Pending</MenuItem>
    <MenuItem isSucceeded>Succeeded</MenuItem>
    <MenuItem isFailed>Failed</MenuItem>
  </ContextMenu>
</ContextMenuTrigger>;
