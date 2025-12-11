import {
  Align,
  Avatar,
  Button,
  Chat,
  Content,
  Header,
  Initials,
  Message,
  MessageThread,
  Text,
  TextArea,
} from "@mittwald/flow-react-components";
import { useForm } from "react-hook-form";
import {
  Field,
  Form,
} from "@mittwald/flow-react-components/react-hook-form";

export default () => {
  const form = useForm<{ message: string }>();

  return (
    <Chat>
      <MessageThread>
        <Message>
          <Header>
            <Align>
              <Avatar>
                <Initials>Max Mustermann</Initials>
              </Avatar>
              <Text>
                <strong>Max Mustermann</strong>
              </Text>
            </Align>
          </Header>
          <Content>
            <Text>
              Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Cumque eius quam quas vel
              voluptas, ullam aliquid fugit. Voluptate harum
              accusantium rerum ullam modi blanditiis vitae,
              laborum ea tempore, dolore voluptas. Earum
              pariatur, similique corrupti id officia
              perferendis. Labore, similique. Earum, quas
              in. At dolorem corrupti blanditiis nulla
              deserunt laborum! Corrupti delectus aspernatur
              nihil nulla obcaecati ipsam porro sequi rem?
              Quam.
            </Text>
          </Content>
        </Message>
      </MessageThread>
      <Form
        form={form}
        onSubmit={() => {
          console.log("submitted");
        }}
      >
        <Field name="message">
          <TextArea
            aria-label="message"
            rows={3}
            autoResizeMaxRows={10}
          />
        </Field>
        <Button color="accent" type="submit">
          Submit
        </Button>
      </Form>
    </Chat>
  );
};
