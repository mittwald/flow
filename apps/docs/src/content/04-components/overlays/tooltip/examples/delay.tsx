import {
  Button,
  IconEdit,
  Tooltip,
  TooltipTrigger,
} from "@mittwald/flow-react-components";

<>
  <TooltipTrigger>
    <Button aria-label="Bearbeiten" variant="plain">
      <IconEdit />
    </Button>
    <Tooltip>Bearbeiten</Tooltip>
  </TooltipTrigger>
  <TooltipTrigger delay="long">
    <Button variant="plain">Bearbeiten</Button>
    <Tooltip>Name und Beschreibung ändern</Tooltip>
  </TooltipTrigger>
</>;
