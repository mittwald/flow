"use client";
import type { CSSProperties, FC, PropsWithChildren } from "react";
import styles from "./primitives.module.scss";

type Tone =
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900"
  | "1000"
  | "1100"
  | "1200";

interface PrimitiveProps extends PropsWithChildren {
  className?: string;
  tone?: Tone;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  padding?: CSSProperties["padding"];
  margin?: CSSProperties["margin"];
  marginBlock?: CSSProperties["marginBlock"];
}

interface LayoutProps extends PropsWithChildren {
  className?: string;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  alignItems?: CSSProperties["alignItems"];
  justifyContent?: CSSProperties["justifyContent"];
  flexDirection?: CSSProperties["flexDirection"];
  borderRadius?: CSSProperties["borderRadius"];
  tone?: Tone;
}

const cx = (...classes: (string | undefined | false)[]) =>
  classes.filter(Boolean).join(" ");

const getToneClass = (tone: Tone = "400") => styles[`tone${tone}`];

export const WFrame: FC<LayoutProps> = (props) => {
  const { children, className, ...rest } = props;

  return (
    <div className={cx(styles.frame, className)} style={rest}>
      {children}
    </div>
  );
};

export const WStack: FC<LayoutProps> = (props) => {
  const { children, className, ...rest } = props;

  return (
    <div className={cx(styles.stack, className)} style={rest}>
      {children}
    </div>
  );
};

export const WRow: FC<LayoutProps> = (props) => {
  const { children, className, ...rest } = props;

  return (
    <div
      className={cx(
        styles.row,

        className,
      )}
      style={rest}
    >
      {children}
    </div>
  );
};

export const WBox: FC<PropsWithChildren<LayoutProps>> = (props) => {
  const { children, className, tone, ...rest } = props;

  return (
    <div className={cx(styles.box, getToneClass(tone), className)} style={rest}>
      {children}
    </div>
  );
};

export const WBar: FC<PrimitiveProps> = (props) => {
  const { className, tone = "700", width = "100%", height } = props;

  return (
    <span
      className={cx(styles.bar, getToneClass(tone), className)}
      style={{ width, height }}
    />
  );
};

export const WLine: FC<PrimitiveProps> = (props) => {
  const { className, tone = "500", ...rest } = props;

  return (
    <span
      className={cx(styles.line, getToneClass(tone), className)}
      style={rest}
    />
  );
};

export const WCircle: FC<PrimitiveProps> = (props) => {
  const { className, tone = "500", children, ...rest } = props;

  return (
    <span
      className={cx(styles.circle, getToneClass(tone), className)}
      style={{ ...rest }}
    >
      {children}
    </span>
  );
};

export const WInput: FC<PropsWithChildren<LayoutProps>> = (props) => {
  const { children, className, tone = "100", ...rest } = props;

  return (
    <div
      className={cx(styles.input, getToneClass(tone), className)}
      style={rest}
    >
      {children}
    </div>
  );
};

export const WOverlay: FC<PropsWithChildren<LayoutProps>> = (props) => {
  const { children, className, tone = "100", ...rest } = props;

  return (
    <div
      className={cx(styles.overlay, getToneClass(tone), className)}
      style={rest}
    >
      {children}
    </div>
  );
};

export const WButton: FC<PropsWithChildren<PrimitiveProps>> = (props) => {
  const { children, className, tone = "700", width, height } = props;

  return (
    <div
      className={cx(styles.button, getToneClass(tone), className)}
      style={{ width, height }}
    >
      {children}
    </div>
  );
};

export const WText: FC<PropsWithChildren<PrimitiveProps>> = (props) => {
  const { children, className, tone = "500", width, height = 16 } = props;

  return (
    <div
      className={cx(styles.text, getToneClass(tone), className)}
      style={{ width, height }}
    >
      {children}
    </div>
  );
};
