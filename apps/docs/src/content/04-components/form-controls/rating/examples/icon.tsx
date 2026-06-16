import {
  Icon,
  Rating,
} from "@mittwald/flow-react-components";
import {
  IconLeaf,
  IconLeafFilled,
} from "@tabler/icons-react";

<Rating
  aria-label="Bewertung"
  iconEmpty={
    <Icon>
      <IconLeaf />
    </Icon>
  }
  iconFilled={
    <Icon status="success">
      <IconLeafFilled />
    </Icon>
  }
  defaultValue={2}
/>;
