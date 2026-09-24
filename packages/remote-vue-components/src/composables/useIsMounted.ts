import { onMounted, readonly, ref, type Ref } from "vue";

/** Whether the component has mounted — the client-only guard. */
export const useIsMounted = (): Readonly<Ref<boolean>> => {
  const isMounted = ref(false);
  onMounted(() => (isMounted.value = true));
  return readonly(isMounted);
};
