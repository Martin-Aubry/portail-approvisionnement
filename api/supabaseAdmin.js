const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://hwvyaeyyeddzyxprpjmn.supabase.co";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Ne jamais exposer côté frontend

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

module.exports = supabaseAdmin;
