import type { FC, PropsWithChildren } from "react";
import { RouterProvider as BaseRouterProvider } from "react-aria-components";
import { useRouter } from "next/navigation";

export const RouterProvider: FC<PropsWithChildren> = (props) => {
  const router = useRouter();
  return (
    <BaseRouterProvider navigate={router.push}>
      {props.children}
    </BaseRouterProvider>
  );
};

export default RouterProvider;
