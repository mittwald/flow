# Contribute

## Visual Regression Testing

In the `src/tests/visual` directory, you will find visual regression tests for
most components. The goal of these tests is to detect early whether, after a
change:

1. **the visual appearance of one or more components has changed
   unintentionally** Example: A change to a design token affects more components
   than expected.

2. **components behave incorrectly** Example: A context menu no longer opens or
   is positioned incorrectly, or Buttons are not correctly positioned when used
   in the header of a Section.

### Testing Remote Components

Tests should always be executed in both the **remote** and the **local
environment**. To make this as easy as possible, predefined test environments
are available and can conveniently be used with `test.each`.

Have a look at existing tests for reference.

### Running the Tests

First, install the required test browsers:

```sh
pnpm test:browser:prepare
```

You can then run the tests using the following command:

```sh
pnpm nx run remote-react-components:test:visual --browser.name=webkit
```

The tests run **headless** and only in Webkit. Firefox is also available as a
browser option, but it has issues with parallelized testing.

If differences are detected, corresponding screenshots are created and listed in
the test results.

In **dev mode**, a “real” browser is opened, allowing you to interact directly
with the test:

```sh
pnpm nx run remote-react-components:test:visual:dev --browser.name=webkit
```

#### Remote ≠ Local

If there are differences between local and remote rendering, separate files are
generated, for example:

- `*--Remote--1.png`
- `*--Local--1.png`

In this case, it is helpful to further inspect the rendering using **Storybook**
and the **remote demo app**.

**Do not commit these files!**

### Updating Screenshots

If you make changes to existing components or develop new components or
features, you can update the screenshots as follows:

```sh
pnpm nx run remote-react-components:test:visual:update
```

You can also filter the tests, to only run relevant tests.

```sh
pnpm nx run remote-react-components:test:visual:update NewComponent
```

Carefully review all new or updated screenshots afterward. If everything looks
correct, you can commit them.

Then add the `update-screenshots` label to the pull request. This ensures that
the screenshots used in CI (Linux) are updated as well.

### What and how to test?

1. **Test behavior** Interact with components in your tests and take appropriate
   screenshots. Example:
   - before opening a modal
   - after it has opened
   - after it has been closed

2. **Test states and properties** Test different properties and states of
   components. Example:
   - different variants and colors
   - states such as `hovered` (not recommended by now due to flakiness),
     `disabled`, etc. (preferably combined in a single screenshot)

3. **Test component combinations** One of Flow’s strengths is that components
   can be combined and adapt to each other dynamically. **Make sure to test
   these constellations as well!** Example: A button is placed on the right side
   of a section header and displayed in its small variant.

The best way to learn how tests are structured is to look at existing test
cases.

### Notes on Chromium

Due to its wide adoption, Chromium would normally be a good choice as a test
browser. However, there are currently issues when running the tests in CI, where
random errors like the following occur:

```
Error: Failed to import test file
/home/runner/work/flow/flow/packages/remote-react-components/src/tests/visual/AlertBadge.browser.test.tsx

Caused by: TypeError: Failed to fetch dynamically imported module:
http://localhost:63315/home/runner/work/flow/flow/packages/remote-react-components/src/tests/visual/AlertBadge.browser.test.tsx?import&browserv=1765973079806
```

For this reason, Chromium has been disabled in the following file:
[https://github.com/mittwald/flow/blob/main/packages/core/src/vitestBrowserTestConfig.ts](https://github.com/mittwald/flow/blob/main/packages/core/src/vitestBrowserTestConfig.ts)

The current solution is to wait for an update of **Playwright**.

### CI

For pull requests, visual tests are executed **with a single browser only**
(currently **Webkit**), to reduce the pipeline execution time.

In addition, visual tests are run **with all supported browsers** twice a day to
detect potential issues early.
