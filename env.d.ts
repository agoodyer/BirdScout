/// <reference types="react-scripts" />

// Add custom type definitions for process.env
interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_KEY: string;
  readonly SUPABASE_STORAGE_URL: string;
  readonly FIREBASE_API_KEY: string;
  readonly OPENAI_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
