# @mittwald/mstudio-ext-react-components

React components that can be used by mStudio extension developers

This package is part of
[Flow – mittwald design system](https://mittwald.github.io/flow/). See the
homepage for more details.

## Customize the mStudio page header for your extension

This package offers some components, to customize and extend the mStudio page
header.

### `<Title>`

With the `<Title>` component you can overwrite the page title of the mStudio
header. You will usually need this customization if your extension has
**subpages**.

**Note**: Refer to the existing pages in the mStudio for best practices.

```tsx
import { Title } from "@mittwald/mstudio-ext-react-components";

function DetailsPage() {
  return (
    <>
      <Title>Details</Title>
      {/* your code */}
    </>
  );
}
```

### `<Actions>`

With the `<Actions>` component you can extend the mStudio actions menu in the
page header. Use the regular `<MenuItem>` component from
`@mittwald/flow-remote-react-components` to define custom menu items.

**Note**: Refer to the existing pages in the mStudio for best practices.

```tsx
import { MenuItem } from "@mittwald/flow-remote-react-components";
import { Actions } from "@mittwald/mstudio-ext-react-components";

function MainPage() {
  return (
    <>
      <Actions>
        <MenuItem onAction={onRename}>Rename</MenuItem>
        <MenuItem onAction={onDelete}>Delete</MenuItem>
      </Actions>
      {/* your code */}
    </>
  );
}
```

### `<Breadcrumb>`

With the `<Breadcrumb>` component you can extend the mStudio with your own
items. Use the regular `<Link>` component from
`@mittwald/flow-remote-react-components` to define custom links. You will
usually need this customization if your extension has **multiple subpages**.

**Note**: Refer to the existing pages in the mStudio for best practices.

```tsx
import { Link } from "@mittwald/flow-remote-react-components";
import { Breadcrumb } from "@mittwald/mstudio-ext-react-components";

function ProfilePage() {
  return (
    <>
      <Breadcrumb>
        <Link href="/profiles">Profiles</Link>
        <Link href="/profiles/5">Profile</Link>
      </Breadcrumb>
      {/* your code */}
    </>
  );
}
```
