import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://plvjwqzoifpkipvovznc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsdmp3cXpvaWZwa2lwdm92em5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NTY0NzcsImV4cCI6MjA5MjQzMjQ3N30.Xepw986FDNabHVmq496AztsW6yHQSy4mR_Pgdog6KI0'


export const supabase = createClient(supabaseUrl, supabaseKey)