// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
    interface Document {
      startViewTransition: (callback: never) => void; // Add your custom property/method here
    }
  }
}

export {};
