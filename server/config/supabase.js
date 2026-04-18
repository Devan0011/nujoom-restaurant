const { createClient } = require('@supabase/supabase-js');

function createSupabaseClient(config) {
  return createClient(config.supabaseUrl, config.supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

module.exports = {
  createSupabaseClient,
};
