/// <reference types="@electron-forge/plugin-vite/forge-vite-env" />

declare module "*.css" {
  const content: string;
  export default content;
}
