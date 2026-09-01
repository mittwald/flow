import {
  Avatar,
  Button,
  ContextMenu,
  ContextMenuTrigger,
  HeaderNavigation,
  Heading,
  IconCamera,
  IconLogout,
  IconNotification,
  IconSearch,
  IconSettings,
  IconSupport,
  Image,
  Initials,
  MenuItem,
  Section,
  Separator,
  Text,
} from "@mittwald/flow-react-components";

<HeaderNavigation aria-label="Header navigation">
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
      <Section>
        <MenuItem>
          <Avatar>
            <Initials>Max Mustermann</Initials>
          </Avatar>
          <IconCamera />
        </MenuItem>
        <Heading>Max Mustermann</Heading>
      </Section>
      <Separator />
      <Section>
        <MenuItem>
          <IconSettings />
          <Text>Profil</Text>
        </MenuItem>
        <MenuItem>
          <IconLogout />
          <Text>Logout</Text>
        </MenuItem>
      </Section>
    </ContextMenu>
  </ContextMenuTrigger>
</HeaderNavigation>;
