import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://exemple.supabase.co' // Copie depuis Project Settings → API
const supabaseAnonKey = 'exemple-anon-key' // Copie depuis Project Settings → API

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
