import { createClient } from '@supabase/supabase-js'

// Projekt URL (https://smadmetqgmdukwfskjif.supabase.co/rest/v1/)
const supabaseUrl = 'https://smadmetqgmdukwfskjif.supabase.co/rest/v1/' 

// Hier kommt der PUBLISHABLE / ANON KEY rein!
const supabaseAnonKey = 'sb_publishable_zclmkpwM2m8g3R35XU6HKw_Un59f87J' 

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
