"use client";
import {
  Flex,
  Heading,
  Icon,
  Label,
  Rating,
  RatingSegment,
} from "@mittwald/flow-remote-react-components";
import {
  IconMoodEmpty,
  IconMoodEmptyFilled,
  IconMoodHappy,
  IconMoodHappyFilled,
  IconMoodSad,
  IconMoodSadFilled,
} from "@tabler/icons-react";

export default function Page() {
  return (
    <Flex direction="column" gap="l">
      <Heading>Default</Heading>
      <Rating defaultValue={2}>
        <Label>Cantina rating</Label>
      </Rating>

      <Heading>Segments with single fill</Heading>
      <Rating fill="single" defaultValue={2}>
        <Label>How was your meal at the cantina?</Label>
        <RatingSegment
          aria-label="Terrible"
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
          aria-label="Okay"
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
          aria-label="Great"
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
      </Rating>
    </Flex>
  );
}
