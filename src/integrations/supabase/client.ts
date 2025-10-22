import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://elazwnzvotqktxjbbguh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsYXp3bnp2b3Rxa3R4amJiZ3VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4OTExMDgsImV4cCI6MjA3NTQ2NzEwOH0.-dttyNvPnxe1SXpIgZ-TD79Dp8Fm2sXv-4G_vqnA-ms';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
