// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
    interface Document {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      startViewTransition: (callback: never) => void; // Add your custom property/method here
    }
  }
}

// biome-ignore lint/complexity/noUselessEmptyExport: <explanation>
// biome-ignore lint/style/useExportType: <explanation>
export {};
