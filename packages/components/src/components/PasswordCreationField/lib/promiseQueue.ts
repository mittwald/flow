import { useRef } from "react";

type Task<T> = () => Promise<T>;

interface PromiseQueueOptions {
  autoStart?: boolean;
}
export class PromiseQueue {
  private queue: (() => Promise<void>)[] = [];
  private running = false;
  private readonly autoStart: boolean;

  constructor(options: PromiseQueueOptions = {}) {
    this.autoStart = options.autoStart ?? true;
  }

  public add<T>(task: Task<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const runner = async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (e) {
          reject(e);
        }
      };
      this.queue.push(runner);
      if (this.autoStart && !this.running) {
        void this.start();
      }
    });
  }

  public async start() {
    if (this.running) {
      return;
    }
    this.running = true;
    while (this.queue.length) {
      const runner = this.queue.shift();
      if (runner) {
        await runner();
      }
    }
    this.running = false;
  }
}

export const usePromiseQueue = () =>
  useRef(new PromiseQueue({ autoStart: true })).current;
