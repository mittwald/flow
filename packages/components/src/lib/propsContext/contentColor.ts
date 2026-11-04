import type { PropsContext } from "@/lib/propsContext/types";
import { dynamic } from "@/lib/propsContext/dynamicProps/dynamic";
import type { AlphaColor } from "@/lib/types/props";

const cache = new Map<AlphaColor, PropsContext>();

const createContentColored = (color: AlphaColor): PropsContext => {
  const entries: PropsContext = {
    InlineCode: { color },
    Badge: {
      color: dynamic((props) =>
        props.color === undefined || props.color === "neutral"
          ? color
          : props.color,
      ),
    },
    Button: {
      color: dynamic((props) =>
        props.color === "secondary" ? color : props.color,
      ),
    },
    CopyButton: {
      color: dynamic((props) =>
        props.color === undefined || props.color === "secondary"
          ? color
          : props.color,
      ),
    },
  };

  return { ...entries, Text: entries };
};

/**
 * Props context entries that tint the neutral content of a colored surface in
 * `color`. `Text` clears the context for its children, so it carries them too.
 * Cached per color, so the props context stays referentially stable.
 */
export const contentColored = (color: AlphaColor): PropsContext => {
  let entries = cache.get(color);
  if (!entries) {
    entries = createContentColored(color);
    cache.set(color, entries);
  }
  return entries;
};

export default contentColored;
