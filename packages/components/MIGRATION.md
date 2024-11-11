## From version 0.1.0-alpha.291 to 0.1.0-alpha.292

### Renamed CSS export

The CSS export `@mittwald/flow-react-components/styles` has renamed to the more
precise name `@mittwald/flow-react-components/all.css`, because the file
contains the CSS of all components, and now there are CSS exports per component
as well. A documentation on how to use them is planned.

```diff
// main.js
- import "@mittwald/flow-react-components/styles";
+ import "@mittwald/flow-react-components/all.css";
```
