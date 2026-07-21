// First-wins customElements.define: the OLD flr-* registrations (imported
// first) survive; the current host's duplicate registration is skipped.
const original = window.customElements.define.bind(window.customElements);
window.customElements.define = ((
  name: string,
  constructor: CustomElementConstructor,
  options?: ElementDefinitionOptions,
) => {
  if (window.customElements.get(name) !== undefined) {
    return;
  }
  original(name, constructor, options);
}) as typeof window.customElements.define;
