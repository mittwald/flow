import { Component, type ReactNode } from "react";

const HOST_ERROR_DELIVERY_TIMEOUT_MS = 1000;

const isNoComponentFoundError = (error: unknown): error is Error =>
  // Couples to the message thrown by @mittwald/remote-dom-react's host renderer.
  error instanceof Error &&
  error.message.startsWith("No component found for remote element");

interface Props {
  children: ReactNode;
  onNoComponentError: (error: Error) => Promise<void>;
}

interface State {
  errorToRethrow?: unknown;
  isHandling: boolean;
}

export class HostRenderErrorBoundary extends Component<Props, State> {
  override state: State = { isHandling: false };

  static getDerivedStateFromError(error: unknown): Partial<State> {
    if (isNoComponentFoundError(error)) {
      return { isHandling: true };
    }

    return { errorToRethrow: error };
  }

  override componentDidCatch(error: unknown): void {
    if (!isNoComponentFoundError(error)) {
      return;
    }

    const timeout = new Promise<void>((resolve) =>
      setTimeout(resolve, HOST_ERROR_DELIVERY_TIMEOUT_MS),
    );

    Promise.race([
      this.props.onNoComponentError(error).catch(() => undefined),
      timeout,
    ]).finally(() => {
      this.setState({ errorToRethrow: error, isHandling: false });
    });
  }

  override render(): ReactNode {
    if ("errorToRethrow" in this.state) {
      throw this.state.errorToRethrow;
    }

    if (this.state.isHandling) {
      return null;
    }

    return this.props.children;
  }
}
