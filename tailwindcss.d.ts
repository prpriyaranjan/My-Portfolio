declare module 'tailwindcss' {
    type TailwindClass = string;
    export type ClassName = TailwindClass | TailwindClass[] | Record<string, boolean> | undefined | null;
  }