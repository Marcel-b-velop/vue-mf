/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "remote-lib/Confirm" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "remote-lib/apiClient" {
  import type { ApiClient } from "remote-lib/types";
  export const apiClient: ApiClient;
}

declare module "remote-lib/types" {
  export interface ApiClient {
    get: <T,>(url: string, config?: any) => Promise<T>;
    post: <T,>(url: string, data?: any, config?: any) => Promise<T>;
    put: <T,>(url: string, data?: any, config?: any) => Promise<T>;
    delete: <T,>(url: string, config?: any) => Promise<T>;
  }
}