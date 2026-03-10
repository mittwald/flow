import { useEffect } from "react";
import { useFormContext } from "../FormContextProvider";

export const useMountedFormRootErrorComponent = () => {
  const controller = useFormContext().rootErrorController;

  useEffect(() => {
    controller.updateErrorComponentMounted(true);
    return () => {
      controller.updateErrorComponentMounted(false);
    };
  }, [controller]);
};
