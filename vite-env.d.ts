/// <reference types="vite/client" />

declare module 'vite-plugin-eslint' {
  import { Plugin } from 'vite'
  function eslint(options?: any): Plugin
  export default eslint
}