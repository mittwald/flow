import type {
  FieldPath,
  FieldPathValue,
  FieldValues,
  Validate,
  ValidateResult,
} from "react-hook-form";

export const debounceValidate = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  validateFunction: Validate<
    FieldPathValue<TFieldValues, TFieldName>,
    TFieldValues
  >,
  waitMs = 500,
) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (
    value: FieldPathValue<TFieldValues, TFieldName>,
    formValues: TFieldValues,
  ) =>
    new Promise<ValidateResult>((resolve, reject) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        Promise.resolve(validateFunction(value, formValues))
          .then(resolve)
          .catch(reject);
      }, waitMs);
    });
};
