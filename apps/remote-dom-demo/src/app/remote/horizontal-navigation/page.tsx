import {
  Link,
  HorizontalNavigation,
  AlertIcon,
} from "@mittwald/flow-remote-react-components";

export default function Page() {
  return (
    <HorizontalNavigation aria-label="Horizontal navigation">
      <Link href="#">Getting started</Link>
      <Link href="#" aria-current="page">
        Components
        <AlertIcon status="warning" />
      </Link>
      <Link href="#">
        Design tokens <AlertIcon status="danger" />
      </Link>
      <Link href="#">Icons</Link>
      <Link href="#">Changelog</Link>
    </HorizontalNavigation>
  );
}
