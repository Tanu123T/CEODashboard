// Keep all Supabase credentials in environment variables.
// Never hardcode service role keys in frontend code.
export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL || '',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
};

export const hasSupabaseConfig = Boolean(
  supabaseConfig.url && supabaseConfig.anonKey,
);

// Placeholder export so modules can safely guard feature usage until backend is wired.
export const createSupabaseClientSafely = async () => {
  if (!hasSupabaseConfig) return null;

  const { createClient } = await import('@supabase/supabase-js');
  return createClient(supabaseConfig.url, supabaseConfig.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
};
