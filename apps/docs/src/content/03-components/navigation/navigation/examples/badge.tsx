import {
  Badge,
  CounterBadge,
  Link,
  Navigation,
} from "@mittwald/flow-react-components";

<Navigation aria-label="Companies">
  <Link>Apps</Link>
  <Link aria-current="page">
    Container <Badge>Neu</Badge>
  </Link>
  <Link>
    Benachrichtigungen <CounterBadge count={3} />
  </Link>
</Navigation>;
