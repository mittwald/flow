import {
  IconStar,
  IconStarFilled,
  ItemAction,
  Label,
  Link,
  Navigation,
  NavigationGroup,
} from "@mittwald/flow-react-components";

<Navigation aria-label="Projekte">
  <NavigationGroup>
    <Label>Favoriten</Label>
    <Link href="#">
      Webshop
      <ItemAction
        visibility="always"
        aria-label="Webshop aus den Favoriten entfernen"
        onPress={() => alert("Webshop entfernen")}
      >
        <IconStarFilled />
      </ItemAction>
    </Link>
  </NavigationGroup>
  <NavigationGroup>
    <Label>Alle Projekte</Label>
    <Link href="#" aria-current="page">
      Blog
      <ItemAction
        aria-label="Blog zu den Favoriten hinzufügen"
        onPress={() => alert("Blog hinzufügen")}
      >
        <IconStar />
      </ItemAction>
    </Link>
    <Link href="#">
      Firmenwebsite
      <ItemAction
        aria-label="Firmenwebsite zu den Favoriten hinzufügen"
        onPress={() => alert("Firmenwebsite hinzufügen")}
      >
        <IconStar />
      </ItemAction>
    </Link>
  </NavigationGroup>
</Navigation>;
