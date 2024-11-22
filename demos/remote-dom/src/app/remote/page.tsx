"use client";
import { Heading, Section } from "@mittwald/flow-remote-react-components";

export default function Page() {
  // const [, , pending] = useActionState(login, null);

  return (
    <Section>
      <Heading>Form</Heading>
      {/*<Form*/}
      {/*  onSubmit={form.handleSubmit((e) => {*/}
      {/*    console.log("!", e);*/}
      {/*  })}*/}
      {/*>*/}
      {/*  <Controller*/}
      {/*    control={form.control}*/}
      {/*    rules={{*/}
      {/*      minLength: 5,*/}
      {/*    }}*/}
      {/*    render={(controller) => (*/}
      {/*      <Input*/}
      {/*        name={controller.field.name}*/}
      {/*        onChange={(e) => {*/}
      {/*          console.log(e);*/}
      {/*          controller.field.onChange(e.detail);*/}
      {/*        }}*/}
      {/*      />*/}
      {/*    )}*/}
      {/*    name="foo"*/}
      {/*  />*/}
      {/*  <Button type="submit">Submit</Button>*/}
      {/*</Form>*/}
      {/*<Form>*/}
      {/*  <Button isPending={pending} type="submit">*/}
      {/*    Absenden*/}
      {/*  </Button>*/}
      {/*</Form>*/}
    </Section>
  );
}
