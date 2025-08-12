import {
  FileCard,
  Button,
  IconChevronDown,
  IconChevronUp,
} from "@mittwald/flow-react-components";

<FileCard
  type="image/jpg"
  name="image.jpg"
  onDelete={() => {
    console.log("delete");
  }}
>
  <Button>
    <IconChevronUp />
  </Button>
  <Button>
    <IconChevronDown />
  </Button>
</FileCard>;
