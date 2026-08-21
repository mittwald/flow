import {
  Icon,
  Label,
  Rating,
  RatingSegment,
} from "@mittwald/flow-react-components";
import {
  IconMoodEmpty,
  IconMoodEmptyFilled,
  IconMoodHappy,
  IconMoodHappyFilled,
  IconMoodSad,
  IconMoodSadFilled,
} from "@tabler/icons-react";

<Rating fill="single" defaultValue={3}>
  <Label>Wie zufrieden bist du?</Label>
  <RatingSegment
    aria-label="Unzufrieden"
    iconEmpty={
      <Icon>
        <IconMoodSad />
      </Icon>
    }
    iconFilled={
      <Icon color="danger">
        <IconMoodSadFilled />
      </Icon>
    }
  />
  <RatingSegment
    aria-label="Neutral"
    iconEmpty={
      <Icon>
        <IconMoodEmpty />
      </Icon>
    }
    iconFilled={
      <Icon color="warning">
        <IconMoodEmptyFilled />
      </Icon>
    }
  />
  <RatingSegment
    aria-label="Zufrieden"
    iconEmpty={
      <Icon>
        <IconMoodHappy />
      </Icon>
    }
    iconFilled={
      <Icon color="success">
        <IconMoodHappyFilled />
      </Icon>
    }
  />
</Rating>;
