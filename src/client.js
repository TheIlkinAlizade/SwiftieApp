
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kzcwjykahmyytszfvfwd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6Y3dqeWthaG15eXRzemZ2ZndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5NDUxNjIsImV4cCI6MjA1NzUyMTE2Mn0.cTwVuFaBSVw0JjYnvdIYjaLrvV3MtQHLaCojOKZh5_c';
export const supabase = createClient(supabaseUrl, supabaseKey);