import Avatar from "@mittwald/flow-react-components/Avatar";
import { AvatarStack } from "@mittwald/flow-react-components/AvatarStack";
import { Button } from "@mittwald/flow-react-components/Button";
import { Initials } from "@mittwald/flow-react-components/Initials";

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
