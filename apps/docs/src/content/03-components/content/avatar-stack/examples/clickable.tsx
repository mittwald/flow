import Avatar from "@mittwald/flow-react-components";
import { AvatarStack } from "@mittwald/flow-react-components";
import { Button } from "@mittwald/flow-react-components";
import { Initials } from "@mittwald/flow-react-components";

<AvatarStack
  onCountPress={() => console.log("count clicked")}
>
  <Button onPress={() => console.log("avatar clicked")}>
    <Avatar>
      <Initials>Max Mustermann</Initials>
    </Avatar>
  </Button>
  <Button onPress={() => console.log("avatar clicked")}>
    <Avatar>
      <Initials>John Doe</Initials>
    </Avatar>
  </Button>
  <Button onPress={() => console.log("avatar clicked")}>
    <Avatar>
      <Initials>Gillian Gopher</Initials>
    </Avatar>
  </Button>
</AvatarStack>;
