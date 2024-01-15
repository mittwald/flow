type Variant = "info" | "success" | "warning" | "negative";

export interface StatusVariantProps<TOmit extends Variant = never> {
  variant?: Exclude<Variant, TOmit>;
}
