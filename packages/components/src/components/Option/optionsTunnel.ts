import type { FlowComponentName } from "@/components/propTypes";
import { dynamic } from "@/lib/propsContext";
import { getOptionValue } from "./Option";

export const optionsTunnelId = "options";

/**
 * Props context entry that routes a field's `Option` children through its
 * "options" tunnel.
 *
 * The entry id is the option's own collection key rather than a generated one.
 * react-aria renders collection children twice — once into its hidden
 * collection document, once for real — and both renders register a tunnel
 * entry. With a generated id each render becomes its own entry, so the tunnel
 * exit renders every option twice: the collection then holds two element nodes
 * per key, and the `prevKey`/`nextKey` links derived from that doubled sibling
 * chain form a ring. That ring makes `ArrowUp` on the first option wrap to the
 * last one, and lets react-stately's focus restoration walk `getKeyBefore`
 * forever, which freezes the tab.
 *
 * An option without a value keeps a generated id. Its collection key is a
 * react-aria render counter in that case, which is unstable for other reasons
 * already — `Option` warns about it.
 */
export const getOptionsTunnelProps = (component: FlowComponentName) =>
  dynamic<"Option", "tunnel">((optionProps) => {
    const value = getOptionValue(optionProps);

    return {
      id: optionsTunnelId,
      component,
      staticEntryId: value === undefined ? undefined : String(value),
    };
  });
