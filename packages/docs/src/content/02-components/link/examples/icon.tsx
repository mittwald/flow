import Link from "@mittwald/flow-react-components/Link";
import Icon from "@mittwald/flow-react-components/Icon";
import faExternalLink from "@fortawesome/free-solid-svg-icons/faExternalLink";

//ToDo: External Link Icon wird nicht gefunden

<Link href="https://mittwald.de">
  mittwald.de
  <Icon
    faIcon={faExternalLink}
    aria-label="external link"
  />
</Link>;
