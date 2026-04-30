
import { createClient } from '@supabase/supabase-js'

// 1. URL korrigiert (ohne /rest/v1/)
const supabaseUrl = 'https://supabase.co' 

// 2. Dein Publishable Key
const supabaseAnonKey = 'sb_publishable_zclmkpwM2m8g3R35XU6HKw_Un59f87J' 

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
