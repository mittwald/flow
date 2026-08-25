"use client";
import {
  Flex,
  Heading,
  Icon,
  Label,
  Rating,
  RatingSegment,
  Text,
} from "@mittwald/flow-remote-react-components";
import {
  Field,
  Form,
  SubmitButton,
} from "@mittwald/flow-remote-react-components/react-hook-form";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  IconMoodEmpty,
  IconMoodEmptyFilled,
  IconMoodHappy,
  IconMoodHappyFilled,
  IconMoodSad,
  IconMoodSadFilled,
} from "@tabler/icons-react";

export default function Page() {
  const form = useForm({ defaultValues: { cantina: 3 } });
  const [submitted, setSubmitted] = useState<number>();

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

      <Heading>In a form</Heading>
      <Form form={form} onSubmit={(data) => setSubmitted(data.cantina)}>
        <Field
          name="cantina"
          rules={{ min: { value: 1, message: "Required!" } }}
        >
          <Rating>
            <Label>Cantina rating</Label>
          </Rating>
        </Field>
        <SubmitButton>Submit</SubmitButton>
      </Form>
      <Text>Submitted: {submitted ?? "nothing yet"}</Text>
    </Flex>
  );
}
