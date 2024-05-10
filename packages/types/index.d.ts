// we need to tell TypeScript that
// when we write "import styles from './styles.module.scss'
// we mean to load a module
declare module "*.module.scss";

declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_BASE_URL: string;
  }
}
