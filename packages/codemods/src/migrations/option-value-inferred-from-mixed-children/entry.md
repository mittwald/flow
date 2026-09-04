---
since: 1.1.12
title: "Option: value is inferred from mixed children"
kind: migration
action: none
remotePackage: true
apply:
  "No code change required for the option itself. An `Option` whose children are
  text plus an element — text and a `Badge`, text and an icon — now carries that
  text as its key, where it previously fell back to react-aria's generated
  `react-aria-N`. Check anywhere such a key was read back: a stored or
  server-side selection, a `defaultValue`/`value` matched against it, or a test
  asserting on it. Pass an explicit `value` to pin the key to something other
  than the display text."
---

An `Option` used to infer its `textValue` — and, through it, its `value` — only
when its children were exactly one text node. Text next to any element left both
undefined, so react-aria assigned the option a key off a render-order counter:

```tsx
<Select>
  <Option>
    Millennium Falcon <Badge>Latest</Badge>
  </Option>
  <Option>X-Wing</Option>
</Select>
```

| Option                        | key before     | key now             |
| ----------------------------- | -------------- | ------------------- |
| `Millennium Falcon` + `Badge` | `react-aria-1` | `Millennium Falcon` |
| `X-Wing`                      | `X-Wing`       | `X-Wing`            |

The key is what the field reports as its selected value and what `defaultValue`
has to match, so the old key made the field submit a meaningless string, could
not be preselected, and shifted when unrelated markup around it changed.

Only text that is a child itself contributes — text inside an element child does
not, so the option above is `"Millennium Falcon"` and not
`"Millennium Falcon Latest"`.

An `Option` with no text among its children at all still has no key to infer,
and now says so on the console instead of failing silently:

```tsx
// logs: An <Option> has no 'value' and none could be inferred from its children…
<Option>
  <Text>Millennium Falcon</Text>
</Option>
```

Give those options a `value`:

```diff
- <Option>
+ <Option value="millennium-falcon">
    <Text>Millennium Falcon</Text>
  </Option>
```
