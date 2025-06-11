import { type FC, type PropsWithChildren } from "react";
import { RouterProvider as BaseRouterProvider } from "react-aria-components";
import { useRouter } from "next/navigation";
import { addBasePath } from "next/dist/client/add-base-path";

export const RouterProvider: FC<PropsWithChildren> = (props) => {
  const router = useRouter();
  return (
    <BaseRouterProvider navigate={router.push} useHref={addBasePath}>
      {props.children}
    </BaseRouterProvider>
  );
};

export default RouterProvider;
