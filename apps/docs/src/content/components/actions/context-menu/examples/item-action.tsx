import {
  Button,
  ContextMenu,
  ContextMenuTrigger,
  IconDelete,
  IconStar,
  MenuItem,
  ItemAction,
  Text,
} from "@mittwald/flow-react-components";

<ContextMenuTrigger>
  <Button>Zuletzt geöffnet</Button>
  <ContextMenu
    onAction={(id) => {
      alert(`${id} öffnen`);
    }}
  >
    <MenuItem id="Shop">
      <Text>Shop</Text>
      <ItemAction
        aria-label="Shop aus der Liste entfernen"
        onPress={() => alert("Shop entfernen")}
      >
        <IconDelete />
      </ItemAction>
    </MenuItem>
    <MenuItem id="Blog">
      <Text>Blog</Text>
      <ItemAction
        aria-label="Blog aus der Liste entfernen"
        onPress={() => alert("Blog entfernen")}
      >
        <IconDelete />
      </ItemAction>
    </MenuItem>
    <MenuItem id="Website">
      <Text>Website</Text>
      <ItemAction
        visibility="always"
        aria-label="Website als Favorit markieren"
        onPress={() => alert("Website favorisieren")}
      >
        <IconStar />
      </ItemAction>
    </MenuItem>
  </ContextMenu>
</ContextMenuTrigger>;
