import { useMemo, useState, type Dispatch, type SetStateAction } from "react";

export interface FormRootErrorController {
  errorComponentMounted: boolean;
  updateErrorComponentMounted: Dispatch<SetStateAction<boolean>>;
}

export const useFormRootErrorController = (): FormRootErrorController => {
  const [errorComponentMounted, updateErrorComponentMounted] = useState(false);

  return useMemo(
    () => ({
      errorComponentMounted,
      updateErrorComponentMounted,
    }),
    [errorComponentMounted, updateErrorComponentMounted],
  );
};
