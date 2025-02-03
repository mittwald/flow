import { Initials } from "@mittwald/flow-react-components";
import { Avatar } from "@mittwald/flow-react-components";
import { Text } from "@mittwald/flow-react-components";
import { Content } from "@mittwald/flow-react-components";

<Content
  style={{
    display: "grid",
    gridTemplateAreas: '"avatar title" "avatar subtitle"',
    gridTemplateColumns: "auto 1fr",
    alignItems: "center",
    columnGap: "32px",
    width: "max-content",
    marginLeft: "auto",
    marginRight: "auto",
  }}
>
  <div
    style={{
      gridArea: "avatar",
    }}
  >
    <Avatar>
      <Initials>Sven Fuchs</Initials>
    </Avatar>
  </div>
  <Text
    style={{
      gridArea: "title",
    }}
  >
    <b style={{ margin: 0 }}>Sven Fuchs</b>
  </Text>
  <Text
    style={{
      gridArea: "subtitle",
      fontSize: "14px",
    }}
  >
    Projektentwickler
  </Text>
</Content>;
