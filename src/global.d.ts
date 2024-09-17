declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SITE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    CRYPTO_HEX_KEY: string;
    CRYPTO_HEX_IV: string;
  }
}
