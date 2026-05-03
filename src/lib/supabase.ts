import { supabase } from '../lib/supabase'
import { createClient } from '@supabase/supabase-js'

// HIER fehlte deine Projekt-ID 'smadmetqgmdukwfskjif' am Anfang!
const supabaseUrl = 'https://smadmetqgmdukwfskjif.supabase.co' 

const supabaseAnonKey = 'sb_publishable_zclmkpwM2m8g3R35XU6HKw_Un59f87J' 

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
