import { act, type ReactNode } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";

/*
 * Renders the element to a string like a server would, lets the browser parse
 * that markup and hydrates it. Returns the errors React recovered from: markup
 * the parser rearranged no longer matches React's tree (React error #418).
 */
export const hydrateServerMarkup = async (element: ReactNode) => {
  const container = document.createElement("div");
  container.innerHTML = renderToString(element);
  document.body.append(container);

  const errors: unknown[] = [];
  const root = await act(() =>
    hydrateRoot(container, element, {
      onRecoverableError: (error) => errors.push(error),
    }),
  );

  await act(() => root.unmount());
  container.remove();

  return errors;
};
