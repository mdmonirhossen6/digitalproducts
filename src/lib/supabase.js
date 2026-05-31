import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY

// Use actual credentials if they exist; otherwise, use a placeholder URL and key
// to prevent the entire React application from crashing on startup when deployed.
const isConfigured = !!(SUPABASE_URL && SUPABASE_ANON)

if (!isConfigured) {
  console.warn(
    "⚠️ Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are missing! Please configure them in your environment settings (e.g. Vercel dashboard)."
  )
}

const safeUrl = SUPABASE_URL || 'https://nyihjfiwtqwcbuftjady.supabase.co'
const safeAnon = SUPABASE_ANON || 'sb_publishable_d_5Ji23gsSdDklt01jT4xw_WxCvfCJh'

export const supabase = createClient(safeUrl, safeAnon)

