import { defineComponent, onMounted, ref } from "vue";

/**
 * Renders its children only once mounted.
 *
 * A remote app is client-only by nature, so this matters where the app itself
 * is server-rendered — a Nuxt or Next page hosting the remote root — and a
 * subtree must not be part of that render.
 */
export const BrowserOnly = defineComponent({
  name: "BrowserOnly",

  setup(_props, { slots }) {
    const isMounted = ref(false);
    onMounted(() => (isMounted.value = true));

    return () => (isMounted.value ? slots.default?.() : undefined);
  },
});

export default BrowserOnly;
