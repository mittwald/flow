type Variant = "info" | "success" | "warning" | "danger";

export interface StatusVariantProps<TOmit extends Variant = never> {
  variant?: Exclude<Variant, TOmit>;
}
