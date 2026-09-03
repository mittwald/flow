import type { FieldError } from "react-hook-form";

export class FormRootError extends Error {
  public readonly type: string;

  public constructor(fieldError: FieldError) {
    super(fieldError.message);
    this.name = "FormRootError";
    this.type = fieldError.type;
  }
}
