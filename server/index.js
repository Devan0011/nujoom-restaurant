const app = require('./app');
const config = require('./config/env');

app.listen(config.port, "0.0.0.0", () => {
  console.log(`Server running on port ${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`Connected to Supabase: ${config.supabaseUrl ? 'Yes' : 'No'}`);
});
