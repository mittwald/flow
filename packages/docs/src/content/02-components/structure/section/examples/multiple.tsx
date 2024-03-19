import Heading from "@mittwald/flow-react-components/Heading";
import Text from "@mittwald/flow-react-components/Text";
import Link from "@mittwald/flow-react-components/Link";
import Section from "@mittwald/flow-react-components/Section";
import TextField from "@mittwald/flow-react-components/TextField";
import Label from "@mittwald/flow-react-components/Label";

<>
  <Section>
    <Heading>Personal Information</Heading>
    <TextField isRequired defaultValue="John">
      <Label>First name</Label>
    </TextField>
    <TextField isRequired defaultValue="Doe">
      <Label>Last name</Label>
    </TextField>
  </Section>
  <Section>
    <Heading>Newsletter</Heading>
    <Text>
      Upcoming releases, new features and tips about your
      hosting - we bring you the most important information
      in your inbox. Subscribe to our newsletter and stay up
      to date.
    </Text>
    <Link href="#">Subscribe</Link>
  </Section>
</>;
