import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kfhulgqrkyfcypgzsgkw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmaHVsZ3Fya3lmY3lwZ3pzZ2t3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY3MTM1NzAsImV4cCI6MjA0MjI4OTU3MH0.2rq8PoyQ1XRvvo6ZdcTwBsitC2cn6OtVITjhsMYbs98';  // Supabaseの公開APIキー
export const supabase = createClient(supabaseUrl, supabaseKey);