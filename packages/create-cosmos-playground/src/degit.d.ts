declare module 'degit' {
  export interface DegitOptions {
    cache?: boolean;
    force?: boolean;
    verbose?: boolean;
    mode?: string;
  }

  export interface DegitEmitter {
    clone(dest: string): Promise<void>;
    on(event: string, callback: (...args: unknown[]) => void): this;
  }

  export default function degit(src: string, options?: DegitOptions): DegitEmitter;
}
