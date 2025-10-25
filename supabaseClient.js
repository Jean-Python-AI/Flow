import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wqgynkfvczubilsibmnh.supabase.co' // Copie depuis Project Settings → API
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxZ3lua2Z2Y3p1Ymlsc2libW5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNjgxMTMsImV4cCI6MjA3NTc0NDExM30.pr7MiZR_JMdSOzqkK056oNW7LN_AIUCJauigg6Oz5Vc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
