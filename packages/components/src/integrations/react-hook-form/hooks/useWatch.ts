import { useFormContext } from "@/integrations/react-hook-form/components/context/formContext";
import { useWatch, type FieldPath, type FieldValues } from "react-hook-form";

export const buildUseWatch =
  <
    TFieldValues extends FieldValues,
    TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  >() =>
  (field: TFieldName) => {
    const form = useFormContext<TFieldValues>().form;
    return useWatch({
      name: field,
      control: form.control,
    });
  };
