import Button from "@mittwald/flow-react-components/Button";
import HeaderNavigation from "@mittwald/flow-react-components/HeaderNavigation";
import {
  IconLogout,
  IconNotification,
  IconSettings,
  IconSupport,
  IconSearch,
} from "@mittwald/flow-react-components/Icons";
import ContextMenu, {
  ContextMenuItem,
  ContextMenuTrigger,
} from "@mittwald/flow-react-components/ContextMenu";
import Avatar from "@mittwald/flow-react-components/Avatar";
import { Image } from "@mittwald/flow-react-components/Image";
import Text from "@mittwald/flow-react-components/Text";

<HeaderNavigation aria-label="HeaderNavigation">
  <Button>
    <IconSearch />
  </Button>
  <Button>
    <IconSupport />
  </Button>
  <Button>
    <IconNotification />
  </Button>
  <ContextMenuTrigger>
    <Button>
      <Avatar>
        <Image
          alt="Gopher"
          src="https://cdn.shopify.com/s/files/1/2022/6883/products/IMG_2002_250x250@2x.JPG?v=1538235544"
        />
      </Avatar>
    </Button>
    <ContextMenu>
      <ContextMenuItem>
        <IconSettings />
        <Text>Profile</Text>
      </ContextMenuItem>
      <ContextMenuItem>
        <IconLogout />
        <Text>Logout</Text>
      </ContextMenuItem>
    </ContextMenu>
  </ContextMenuTrigger>
</HeaderNavigation>;
